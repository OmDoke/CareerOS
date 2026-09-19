import { telegramProvider } from "../providers/telegram.provider";
import { telegramRepository } from "../repositories/telegram.repository";
import { userRepository } from "../repositories/user.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { logger } from "../utils/logger";
import { naukriService } from "./naukri.service";
import { evaluationService } from "./evaluation.service";
import { db } from "../db/database";
import crypto from "crypto";

export class TelegramService {
  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    const bot = telegramProvider.getBot();
    if (!bot) return;

    bot.onText(/\/start (.+)/, async (msg: any, match: any) => {
      const chatId = msg.chat.id.toString();
      const token = match?.[1];

      if (!token) {
        await telegramProvider.sendMessage(chatId, "Welcome to CareerOS! To connect your account, please generate a link from your dashboard.");
        return;
      }

      try {
        const connection = await telegramRepository.findConnectionByToken(token);

        if (!connection || connection.used || connection.expiresAt < new Date()) {
          await telegramProvider.sendMessage(chatId, "❌ Invalid or expired connection token. Please generate a new one from your dashboard.");
          return;
        }

        // Link account
        await userRepository.update(connection.userId, {
          telegramChatId: chatId,
          telegramUsername: msg.from?.username || null,
          telegramConnected: true,
          telegramConnectedAt: new Date()
        });

        // Mark token as used
        await telegramRepository.updateConnection(connection.id, { used: true });

        // Initialize default settings if they don't exist
        const settings = await notificationRepository.findSettingsByUserId(connection.userId);
        if (!settings) {
          await notificationRepository.createSettings({ userId: connection.userId });
        }

        await telegramProvider.sendMessage(chatId, `✅ Successfully connected to your CareerOS account, ${connection.user.firstName || connection.user.email}! \n\nI will now send you daily study reminders, personalized motivation, and weekly progress reports based on your settings.`);

      } catch (error) {
        logger.error({ err: error, chatId }, "Error processing telegram /start command");
        await telegramProvider.sendMessage(chatId, "❌ An error occurred while linking your account. Please try again.");
      }
    });

    bot.onText(/\/start$/, async (msg: any) => {
      const chatId = msg.chat.id.toString();
      await telegramProvider.sendMessage(chatId, "Welcome to CareerOS! To connect your account, please generate a link from your web dashboard.");
    });

    bot.onText(/\/naukri/, async (msg: any) => {
      const chatId = msg.chat.id.toString();
      const allowedId = process.env.TELEGRAM_ALLOWED_USER_ID;

      // Ensure authorized access
      if (allowedId && chatId !== allowedId) {
        // Fallback: Check if they are connected to CareerOS
        const user = await userRepository.findByTelegramId(chatId);
        if (!user) {
          await telegramProvider.sendMessage(chatId, "❌ Unauthorized. You must connect your CareerOS account or be the designated admin to use this command.");
          return;
        }
      }

      await telegramProvider.sendMessage(chatId, "🔄 Starting Naukri profile refresh...");
      const result = await naukriService.updateProfileSummary();
      
      if (result.success) {
        await telegramProvider.sendMessage(chatId, `✅ ${result.message}`);
      } else {
        await telegramProvider.sendMessage(chatId, `❌ ${result.message}`);
      }
    });

    // Handle standard messages (answers to questions)
    bot.on("message", async (msg: any) => {
      // Ignore commands
      if (msg.text && msg.text.startsWith("/")) return;

      const chatId = msg.chat.id.toString();
      const user = await userRepository.findByTelegramId(chatId);
      if (!user) return;

      // Check if user has a pending question
      const pendingAttempt = await db.query.questionAttempts.findFirst({
        where: (q, { eq, and }) => and(eq(q.userId, user.id), eq(q.status, "PENDING")),
      });

      if (!pendingAttempt) {
        // Just ignore or send a fallback message if you prefer
        return;
      }

      await telegramProvider.sendMessage(chatId, "🧠 Evaluating your answer...");

      try {
        const timeTaken = Math.floor((Date.now() - pendingAttempt.createdAt.getTime()) / 1000); // rough estimate
        const result = await evaluationService.evaluateAnswer(user.id, {
          questionId: pendingAttempt.id,
          studyTaskId: pendingAttempt.studyTaskId,
          studySessionId: pendingAttempt.studySessionId,
          roadmapTopicId: pendingAttempt.topicId,
          question: pendingAttempt.question,
          questionType: pendingAttempt.questionType || "THEORY",
          difficulty: pendingAttempt.difficulty,
          userAnswer: msg.text,
          timeTaken,
        });

        // Send feedback
        let feedbackMessage = `📊 *Score*: ${result.overallScore}/100\n\n`;
        feedbackMessage += `📝 *Feedback*: ${result.feedback}\n\n`;
        if (result.mistakes) {
          feedbackMessage += `⚠️ *Mistakes*: ${result.mistakes}\n\n`;
        }
        feedbackMessage += `✅ *Optimized Answer*: ${result.optimizedAnswer}`;

        await telegramProvider.sendMessage(chatId, feedbackMessage);

      } catch (error: any) {
        logger.error({ err: error, userId: user.id }, "Failed to evaluate answer from Telegram");
        await telegramProvider.sendMessage(chatId, "❌ Failed to evaluate your answer. Please try again later.");
      }
    });
  }

  async generateConnectToken(userId: string): Promise<string> {
    // 6-character random token
    const token = crypto.randomBytes(3).toString("hex").toUpperCase();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await telegramRepository.createConnection({
      userId,
      token,
      expiresAt
    });

    return token;
  }

  async disconnect(userId: string) {
    const user = await userRepository.findById(userId);
    if (user?.telegramChatId) {
      await telegramProvider.sendMessage(user.telegramChatId, "🔌 Your CareerOS account has been disconnected from this Telegram bot.");
    }

    await userRepository.update(userId, {
      telegramChatId: null,
      telegramUsername: null,
      telegramConnected: false,
      telegramConnectedAt: null
    });
  }
  
  async getStatus(userId: string) {
    const user = await userRepository.findById(userId);
    return {
      connected: user?.telegramConnected || false,
      username: user?.telegramUsername || null,
      connectedAt: user?.telegramConnectedAt || null
    };
  }
}

export const telegramService = new TelegramService();
