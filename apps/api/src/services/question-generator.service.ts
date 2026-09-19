import { aiProviderService } from "./ai-provider.service";
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
    userId: string;
  }) {
    try {
      const prompt = getQuestionGenerationPrompt(context);
      const { provider, model } = await aiProviderService.getProviderForUser(context.userId);
      const generatedData = await provider.generateJSON(prompt, model);

      // Validate structure
      if (!generatedData.question || !generatedData.type || !generatedData.difficulty) {
        throw new AppError("Invalid output format from Gemini", 500);
      }

      return {
        type: generatedData.type,
        difficulty: generatedData.difficulty,
        question: generatedData.question,
        codeSnippet: generatedData.codeSnippet || null,
        options: Array.isArray(generatedData.options) ? generatedData.options : null,
      };
    } catch (error) {
      if (error instanceof AppError || (error as any)?.statusCode) throw error;
      logger.error({ err: error }, "Failed to generate question with AI");
      throw new AppError("Failed to generate dynamic question.", 500);
    }
  }

  async generateHint(userId: string, question: string, userAnswer: string | null) {
    try {
      const prompt = getQuestionHintPrompt(question, userAnswer);
      const { provider, model } = await aiProviderService.getProviderForUser(userId);
      const generatedData = await provider.generateJSON(prompt, model);

      if (!generatedData.hint) {
        throw new AppError("Invalid hint format from Gemini", 500);
      }

      return generatedData.hint;
    } catch (error) {
      if (error instanceof AppError || (error as any)?.statusCode) throw error;
      logger.error({ err: error }, "Failed to generate hint with AI");
      throw new AppError("Failed to generate hint.", 500);
    }
  }

  async generateExplanation(userId: string, question: string) {
    try {
      const prompt = getQuestionExplanationPrompt(question);
      const { provider, model } = await aiProviderService.getProviderForUser(userId);
      const generatedData = await provider.generateJSON(prompt, model);

      if (!generatedData.explanation) {
        throw new AppError("Invalid explanation format from Gemini", 500);
      }

      return generatedData.explanation;
    } catch (error) {
      if (error instanceof AppError || (error as any)?.statusCode) throw error;
      logger.error({ err: error }, "Failed to generate explanation with AI");
      throw new AppError("Failed to generate explanation.", 500);
    }
  }
}

export const questionGeneratorService = new QuestionGeneratorService();
