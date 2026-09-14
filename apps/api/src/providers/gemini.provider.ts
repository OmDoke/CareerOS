import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export const geminiProvider = {
  async generateJSON(prompt: string): Promise<any> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
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
  },
};
