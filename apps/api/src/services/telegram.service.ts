import { telegramProvider } from "../providers/telegram.provider";
import { telegramRepository } from "../repositories/telegram.repository";
import { userRepository } from "../repositories/user.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { logger } from "../utils/logger";
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
