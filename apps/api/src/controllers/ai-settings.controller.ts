import { Request, Response } from "express";
import { aiProviderRepository } from "../repositories/ai-provider.repository";
import { cryptoService } from "../services/crypto.service";
import { ProviderFactory } from "../providers/provider.factory";
import { logger } from "../utils/logger";
import { AppError } from "../errors/custom-errors";

export class AISettingsController {
  /**
   * Get the current user's AI Provider settings (masked)
   */
  async getSettings(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError("Unauthorized", 401);

    const settings = await aiProviderRepository.findByUserId(userId);

    if (!settings) {
      return res.status(200).json({
        exists: false,
      });
    }

    const decryptedKey = cryptoService.decrypt(settings.encryptedApiKey);

    res.status(200).json({
      exists: true,
      provider: settings.provider,
      maskedApiKey: cryptoService.maskApiKey(decryptedKey),
      selectedModel: settings.selectedModel,
      isConnected: settings.isConnected,
      lastValidated: settings.lastValidated,
    });
  }

  /**
   * Update or create the AI Provider settings
   */
  async updateSettings(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError("Unauthorized", 401);

    const { provider = "GEMINI", apiKey, selectedModel } = req.body;

    if (!apiKey && !selectedModel) {
      throw new AppError("API key or selected model is required", 400);
    }

    // Upsert the settings
    const currentSettings = await aiProviderRepository.findByUserId(userId);

    let encryptedApiKey = currentSettings?.encryptedApiKey || "";

    if (apiKey) {
      // Validate the API key immediately before saving
      try {
        const aiProvider = ProviderFactory.createProvider(provider, apiKey);
        const isValid = await aiProvider.validateConnection();
        if (!isValid) {
          throw new Error("Invalid API Key");
        }
        encryptedApiKey = cryptoService.encrypt(apiKey);
      } catch (error: any) {
        throw new AppError(error.message || "Failed to validate API key", 400);
      }
    }

    const updated = await aiProviderRepository.upsert(
      userId,
      {
        provider,
        ...(apiKey && { encryptedApiKey }),
        ...(selectedModel && { selectedModel }),
        isConnected: true,
        lastValidated: new Date(),
      },
      {
        userId,
        provider,
        encryptedApiKey,
        selectedModel,
        isConnected: true,
        lastValidated: new Date(),
      }
    );

    const decryptedKey = cryptoService.decrypt(updated.encryptedApiKey);

    res.status(200).json({
      success: true,
      provider: updated.provider,
      maskedApiKey: cryptoService.maskApiKey(decryptedKey),
      selectedModel: updated.selectedModel,
      isConnected: updated.isConnected,
    });
  }

  /**
   * Delete the AI Provider settings
   */
  async deleteSettings(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError("Unauthorized", 401);

    await aiProviderRepository.deleteByUserId(userId);

    res.status(200).json({ success: true });
  }

  /**
   * Test the connection dynamically
   */
  async testConnection(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError("Unauthorized", 401);

    const settings = await aiProviderRepository.findByUserId(userId);

    if (!settings || !settings.encryptedApiKey) {
      throw new AppError("No API key configured", 400);
    }

    try {
      const decryptedKey = cryptoService.decrypt(settings.encryptedApiKey);
      const aiProvider = ProviderFactory.createProvider(settings.provider, decryptedKey);
      
      const start = Date.now();
      const isValid = await aiProvider.validateConnection();
      const latency = Date.now() - start;

      if (isValid) {
        await aiProviderRepository.updateByUserId(userId, {
          isConnected: true, lastValidated: new Date()
        });

        res.status(200).json({ success: true, latency });
      } else {
        await aiProviderRepository.updateByUserId(userId, {
          isConnected: false
        });

        res.status(400).json({ success: false, message: "Connection test failed. Key may be invalid or expired." });
      }
    } catch (error: any) {
      logger.error({ err: error }, "Test connection failed");
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Fetch available models
   */
  async getModels(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError("Unauthorized", 401);

    const settings = await aiProviderRepository.findByUserId(userId);

    if (!settings || !settings.encryptedApiKey) {
      throw new AppError("No API key configured", 400);
    }

    try {
      const decryptedKey = cryptoService.decrypt(settings.encryptedApiKey);
      const aiProvider = ProviderFactory.createProvider(settings.provider, decryptedKey);
      
      const models = await aiProvider.getAvailableModels();
      
      res.status(200).json({ success: true, models });
    } catch (error: any) {
      logger.error({ err: error }, "Failed to fetch models");
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const aiSettingsController = new AISettingsController();
