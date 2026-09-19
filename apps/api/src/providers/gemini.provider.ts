import { GoogleGenAI } from "@google/genai";
import { logger } from "../utils/logger";
import { AIProvider } from "./provider.interface";
import { AppError } from "../errors/custom-errors";

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new AppError("Gemini API key is required", 400);
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateJSON(prompt: string, model: string): Promise<any> {
    try {
      let finalModel = model || "gemini-3.6-flash";
      if (finalModel.includes("gemini-2.5-flash")) {
        finalModel = "gemini-3.6-flash";
      }

      const response = await this.ai.models.generateContent({
        model: finalModel,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2, // Low temperature for more deterministic output
        },
      });

      const text = response.text;
      if (!text) {
        throw new AppError("Empty response from Gemini API", 500);
      }

      return JSON.parse(text);
    } catch (error: any) {
      logger.error({ err: error }, "Failed to generate JSON with Gemini");
      
      const status = error.status || error.response?.status;
      if (status === 503 || status === "UNAVAILABLE") {
        throw new AppError("The AI model is currently overloaded. Please try again in a few moments.", 503);
      }
      if (status === 429 || status === "RESOURCE_EXHAUSTED") {
        throw new AppError("AI Provider Quota Exceeded. Please try again later or check your API key.", 429);
      }
      
      throw error;
    }
  }

  async generateContent(prompt: string, model: string = "gemini-3.6-flash"): Promise<string> {
    try {
      let finalModel = model || "gemini-3.6-flash";
      if (finalModel.includes("gemini-2.5-flash")) {
        finalModel = "gemini-3.6-flash";
      }

      const response = await this.ai.models.generateContent({
        model: finalModel,
        contents: prompt,
      });

      const text = response.text;
      if (!text) {
        throw new AppError("Empty response from Gemini API", 500);
      }

      return text;
    } catch (error: any) {
      logger.error({ err: error }, "Failed to generate text with Gemini");
      
      const status = error.status || error.response?.status;
      if (status === 503 || status === "UNAVAILABLE") {
        throw new AppError("The AI model is currently overloaded. Please try again in a few moments.", 503);
      }
      if (status === 429 || status === "RESOURCE_EXHAUSTED") {
        throw new AppError("AI Provider Quota Exceeded. Please try again later or check your API key.", 429);
      }
      
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
      
      const generativeModels = models.filter((name: string) => {
        const lowerName = name.toLowerCase();
        return lowerName.includes("gemini") && 
               !lowerName.includes("live") && 
               !lowerName.includes("vision") &&
               !lowerName.includes("embedding");
      });
      
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
