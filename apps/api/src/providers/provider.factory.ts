import { AIProvider } from "./provider.interface";
import { GeminiProvider } from "./gemini.provider";
import { logger } from "../utils/logger";

export class ProviderFactory {
  /**
   * Creates an instance of the requested AI Provider using the provided decrypted API key.
   * Future providers (OpenAI, Anthropic) can be added here.
   */
  static createProvider(providerName: string, apiKey: string): AIProvider {
    if (!apiKey) {
      throw new Error(`API Key is required to initialize provider ${providerName}`);
    }

    switch (providerName.toUpperCase()) {
      case "GEMINI":
        return new GeminiProvider(apiKey);
      
      // Future expansions:
      // case "OPENAI":
      //   return new OpenAIProvider(apiKey);
      // case "ANTHROPIC":
      //   return new AnthropicProvider(apiKey);
      
      default:
        logger.error(`Unsupported provider requested: ${providerName}`);
        throw new Error(`Unsupported AI Provider: ${providerName}`);
    }
  }
}
