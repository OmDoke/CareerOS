import { getResumeAnalysisPrompt } from "@career-os/prompts";
import { aiProviderService } from "./ai-provider.service";
import { resumeRepository } from "../repositories/resume.repository";
import { NotFoundError, BadRequestError, AppError } from "../errors/custom-errors";
import { logger } from "../utils/logger";

export class AiAnalysisService {
  async analyzeResume(userId: string, force: boolean = false) {
    const resume = await resumeRepository.findByUserId(userId);
    
    if (!resume) {
      throw new NotFoundError("Resume not found. Please upload a resume first.");
    }

    if (!resume.extractedText) {
      throw new BadRequestError("Resume has no extracted text. Please re-upload your resume.");
    }

    if (resume.status === "ANALYZED" && !force) {
      return resume; // Already analyzed
    }

    try {
      const prompt = getResumeAnalysisPrompt(resume.extractedText);
      const { provider } = await aiProviderService.getProviderForUser(userId);
      // Force gemini-3.6-flash for resume parsing since it requires strict JSON structure 
      // and we want to avoid quota limits or streaming-only errors from Pro/Live models.
      const structuredData = await provider.generateJSON(prompt, "gemini-3.6-flash");

      // Save structured data — keys must match the prompt schema exactly
      const updatedResume = await resumeRepository.update(userId, {
        name: structuredData.personalInfo?.name || null,
        email: structuredData.personalInfo?.email || null,
        phone: structuredData.personalInfo?.phone || null,

        skills: JSON.stringify(structuredData.skills || []),
        experience: JSON.stringify(structuredData.experience || []),
        education: JSON.stringify(structuredData.education || []),
        projects: JSON.stringify(structuredData.projects || []),

        aiSummary: structuredData.aiSummary || null,
        strengths: JSON.stringify(structuredData.strengths || []),
        weaknesses: JSON.stringify(structuredData.weaknesses || []),
        suggestedSkills: JSON.stringify(structuredData.suggestedSkills || []),

        status: "ANALYZED",
        analysisVersion: "1.0",
        analyzedAt: new Date(),
      });

      return updatedResume;
    } catch (error) {
      if (error instanceof AppError || (error as any)?.statusCode) {
        throw error;
      }
      logger.error({ err: error }, "Failed to analyze resume");
      throw new AppError("Failed to analyze resume with AI.", 500);
    }
  }

  async getAnalysis(userId: string) {
    const resume = await resumeRepository.findByUserId(userId);
    if (!resume) {
      throw new NotFoundError("Resume not found");
    }
    // Return the resume at any status — the frontend shows the Analyze button
    // when status !== "ANALYZED", and the full report when status === "ANALYZED".
    return resume;
  }
}

export const aiAnalysisService = new AiAnalysisService();
