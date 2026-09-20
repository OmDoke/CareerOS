import TelegramBot from "node-telegram-bot-api";
import { logger } from "../utils/logger";
import { env } from "../config/env";

export class TelegramProvider {
  private bot: any | null = null;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    // Check if token exists
    const token = env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      logger.warn("TELEGRAM_BOT_TOKEN is not set. Telegram features will be disabled.");
      return;
    }

    try {
      // Use polling to listen for incoming messages (e.g., /start TOKEN)
      this.bot = new TelegramBot(token, { polling: true });
      this.isInitialized = true;
      logger.info("Telegram Bot successfully initialized with polling enabled.");

      this.bot.on("polling_error", (error: any) => {
        logger.error({ err: error }, "Telegram polling error");
      });

    } catch (error) {
      logger.error({ err: error }, "Failed to initialize Telegram Bot");
    }
  }

  /**
   * Get the underlying bot instance. Useful for attaching listeners in services.
   */
  public getBot(): any | null {
    return this.bot;
  }

  public isEnabled(): boolean {
    return this.isInitialized && this.bot !== null;
  }

  /**
   * Send a formatted message to a specific chat ID.
   */
  public async sendMessage(chatId: string, text: string, options?: any): Promise<boolean> {
    if (!this.isEnabled() || !this.bot) {
      logger.warn("Attempted to send Telegram message, but bot is not initialized.");
      return false;
    }

    try {
      await this.bot.sendMessage(chatId, text, {
        parse_mode: "Markdown",
        ...options,
      });
      return true;
    } catch (error) {
      logger.error({ err: error, chatId }, "Failed to send Telegram message");
      return false;
    }
  }
}

// Singleton instance
export const telegramProvider = new TelegramProvider();
