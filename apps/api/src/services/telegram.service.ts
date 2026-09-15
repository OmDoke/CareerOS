import { telegramProvider } from "../providers/telegram.provider";
import { prisma } from "../database";
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
        const connection = await prisma.telegramConnection.findUnique({
          where: { token },
          include: { user: true }
        });

        if (!connection || connection.used || connection.expiresAt < new Date()) {
          await telegramProvider.sendMessage(chatId, "❌ Invalid or expired connection token. Please generate a new one from your dashboard.");
          return;
        }

        // Link account
        await prisma.user.update({
          where: { id: connection.userId },
          data: {
            telegramChatId: chatId,
            telegramUsername: msg.from?.username || null,
            telegramConnected: true,
            telegramConnectedAt: new Date()
          }
        });

        // Mark token as used
        await prisma.telegramConnection.update({
          where: { id: connection.id },
          data: { used: true }
        });

        // Initialize default settings if they don't exist
        const settings = await prisma.notificationSettings.findUnique({ where: { userId: connection.userId } });
        if (!settings) {
          await prisma.notificationSettings.create({
            data: { userId: connection.userId }
          });
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

    await prisma.telegramConnection.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });

    return token;
  }

  async disconnect(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.telegramChatId) {
      await telegramProvider.sendMessage(user.telegramChatId, "🔌 Your CareerOS account has been disconnected from this Telegram bot.");
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        telegramChatId: null,
        telegramUsername: null,
        telegramConnected: false,
        telegramConnectedAt: null
      }
    });
  }
  
  async getStatus(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return {
      connected: user?.telegramConnected || false,
      username: user?.telegramUsername || null,
      connectedAt: user?.telegramConnectedAt || null
    };
  }
}

export const telegramService = new TelegramService();
