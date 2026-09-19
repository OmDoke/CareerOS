import { aiProviderRepository } from "../repositories/ai-provider.repository";
import { cryptoService } from "./crypto.service";
import { ProviderFactory } from "../providers/provider.factory";
import { AIProvider } from "../providers/provider.interface";
import { logger } from "../utils/logger";
import { AppError } from "../errors/custom-errors";

export const aiProviderService = {
  /**
   * Retrieves the AIProvider instance for a specific user.
   * Also returns the user's selected model to use.
   */
  async getProviderForUser(userId: string): Promise<{ provider: AIProvider; model: string }> {
    const settings = await aiProviderRepository.findByUserId(userId);

    if (!settings || !settings.encryptedApiKey || !settings.isConnected) {
      logger.warn(`User ${userId} attempted to use AI features without a connected provider.`);
      throw new AppError("AI_PROVIDER_NOT_CONFIGURED", 403);
    }

    try {
      const decryptedKey = cryptoService.decrypt(settings.encryptedApiKey);
      const provider = ProviderFactory.createProvider(settings.provider, decryptedKey);
      
      let defaultModel = settings.selectedModel || "gemini-3.6-flash";
      if (defaultModel.includes("gemini-2.5-flash")) {
        defaultModel = "gemini-3.6-flash";
      }
      
      return { provider, model: defaultModel };
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to initialize AI Provider for user");
      
      // Auto-disconnect if decryption fails or key is invalid
      await aiProviderRepository.updateByUserId(userId, { isConnected: false });
      
      throw new AppError("AI_PROVIDER_INITIALIZATION_FAILED", 500);
    }
  }
};
