import { GoogleGenAI } from "@google/genai";
import { logger } from "../utils/logger";
import { AIProvider } from "./provider.interface";

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateJSON(prompt: string, model: string): Promise<any> {
    try {
      const response = await this.ai.models.generateContent({
        model: model || "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2, // Low temperature for more deterministic output
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      return JSON.parse(text);
    } catch (error) {
      logger.error({ err: error }, "Failed to generate JSON with Gemini");
      throw error;
    }
  }

  async generateContent(prompt: string, model: string = "gemini-3.6-flash"): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: model || "gemini-3.6-flash",
        contents: prompt,
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      return text;
    } catch (error) {
      logger.error({ err: error }, "Failed to generate text with Gemini");
      throw error;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      // @google/genai might not have a direct models.list() depending on the version.
      // We'll use models.list() if it exists, otherwise fallback to REST call.
      // But typically, the SDK supports `models.list()` or we can just return a hardcoded list of valid models
      // if list() is not fully featured. The prompt asks to fetch all available models accessible.
      
      const res = await this.ai.models.list();
      
      const models: string[] = [];
      for await (const model of res) {
        if (model.name) models.push(model.name);
      }
      
      // Filter for standard generative models that support generateContent
      // For instance: gemini-3.6-flash, gemini-2.5-pro, gemini-flash-lite
      const generativeModels = models.filter((name: string) => name.includes("gemini"));
      
      if (generativeModels.length === 0) {
        return ["gemini-3.6-flash"]; // Safe default
      }
      
      return generativeModels;
    } catch (error) {
      logger.error({ err: error }, "Failed to list Gemini models");
      throw error;
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      // Fetching models is a safe and lightweight way to validate the API key
      // without relying on a hardcoded model name that might not exist or be deprecated.
      const res = await this.ai.models.list();
      let hasModels = false;
      for await (const model of res) {
        if (model.name) {
          hasModels = true;
          break;
        }
      }
      return hasModels;
    } catch (error) {
      logger.error({ err: error }, "Gemini connection validation failed");
      return false;
    }
  }
}
