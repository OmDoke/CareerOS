import { getResumeAnalysisPrompt } from "@career-os/prompts";
import { geminiProvider } from "../providers/gemini.provider";
import { resumeRepository } from "../repositories/resume.repository";
import { NotFoundError } from "../errors/custom-errors";
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
      const structuredData = await geminiProvider.generateJSON(prompt);

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
      logger.error({ err: error }, "Failed to analyze resume");
      throw new Error("Failed to analyze resume with AI.");
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
