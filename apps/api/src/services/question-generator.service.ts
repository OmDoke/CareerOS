import { geminiProvider } from "../providers/gemini.provider";
import {
  getQuestionGenerationPrompt,
  getQuestionHintPrompt,
  getQuestionExplanationPrompt,
} from "@career-os/prompts";
import { logger } from "../utils/logger";
import { AppError } from "../errors/custom-errors";

export class QuestionGeneratorService {
  async generateQuestion(context: {
    targetRole: string;
    resumeSummary: string;
    currentModule: string;
    currentTopic: string;
    previousTopics: string[];
    targetDifficulty: string;
    previousAttempts: Array<{ question: string; score: number | null; status: string }>;
  }) {
    try {
      const prompt = getQuestionGenerationPrompt(context);
      const generatedData = await geminiProvider.generateJSON(prompt);

      // Validate structure
      if (!generatedData.question || !generatedData.type || !generatedData.difficulty) {
        throw new Error("Invalid output format from Gemini");
      }

      return {
        type: generatedData.type,
        difficulty: generatedData.difficulty,
        question: generatedData.question,
        codeSnippet: generatedData.codeSnippet || null,
        options: Array.isArray(generatedData.options) ? generatedData.options : null,
      };
    } catch (error) {
      logger.error({ err: error }, "Failed to generate question with AI");
      throw new AppError("Failed to generate dynamic question.", 500);
    }
  }

  async generateHint(question: string, userAnswer: string | null) {
    try {
      const prompt = getQuestionHintPrompt(question, userAnswer);
      const generatedData = await geminiProvider.generateJSON(prompt);

      if (!generatedData.hint) {
        throw new Error("Invalid hint format from Gemini");
      }

      return generatedData.hint;
    } catch (error) {
      logger.error({ err: error }, "Failed to generate hint with AI");
      throw new AppError("Failed to generate hint.", 500);
    }
  }

  async generateExplanation(question: string) {
    try {
      const prompt = getQuestionExplanationPrompt(question);
      const generatedData = await geminiProvider.generateJSON(prompt);

      if (!generatedData.explanation) {
        throw new Error("Invalid explanation format from Gemini");
      }

      return generatedData.explanation;
    } catch (error) {
      logger.error({ err: error }, "Failed to generate explanation with AI");
      throw new AppError("Failed to generate explanation.", 500);
    }
  }
}

export const questionGeneratorService = new QuestionGeneratorService();
