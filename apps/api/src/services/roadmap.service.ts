import { getRoadmapGeneratorPrompt } from "@career-os/prompts";
import { aiProviderService } from "./ai-provider.service";
import { roadmapRepository } from "../repositories/roadmap.repository";
import { resumeRepository } from "../repositories/resume.repository";
import { NotFoundError, BadRequestError, AppError } from "../errors/custom-errors";
import { logger } from "../utils/logger";

export class RoadmapService {
  async generateRoadmap(userId: string, targetRole: string, force: boolean = false) {
    if (!targetRole) {
      throw new BadRequestError("Target role is required to generate a roadmap.");
    }

    const exists = await roadmapRepository.exists(userId);
    if (exists && !force) {
      return roadmapRepository.findByUserId(userId);
    }

    const resume = await resumeRepository.findByUserId(userId);
    if (!resume || resume.status !== "ANALYZED") {
      throw new BadRequestError("Resume must be uploaded and analyzed before generating a roadmap.");
    }

    // Prepare resume analysis payload
    const resumeAnalysis = {
      skills: resume.skills ? JSON.parse(resume.skills) : {},
      experience: resume.experience ? JSON.parse(resume.experience) : [],
      education: resume.education ? JSON.parse(resume.education) : [],
      strengths: resume.strengths ? JSON.parse(resume.strengths) : [],
      weaknesses: resume.weaknesses ? JSON.parse(resume.weaknesses) : [],
      suggestedSkills: resume.suggestedSkills ? JSON.parse(resume.suggestedSkills) : [],
    };

    try {
      const prompt = getRoadmapGeneratorPrompt(JSON.stringify(resumeAnalysis), targetRole);
      const { provider, model } = await aiProviderService.getProviderForUser(userId);
      const structuredRoadmap = await provider.generateJSON(prompt, model);

      // Inject target role explicitly
      structuredRoadmap.targetRole = targetRole;

      if (exists) {
        await roadmapRepository.deleteByUserId(userId);
      }

      const roadmap = await roadmapRepository.create(userId, structuredRoadmap);
      return roadmap;
    } catch (error) {
      if (error instanceof AppError || (error as any)?.statusCode) {
        throw error;
      }
      logger.error({ err: error }, "Failed to generate roadmap");
      throw new AppError("Failed to generate learning roadmap with AI.", 500);
    }
  }

  async getRoadmap(userId: string) {
    const roadmap = await roadmapRepository.findByUserId(userId);
    if (!roadmap) {
      throw new NotFoundError("Roadmap not found.");
    }
    
    // Sort topics by order manually
    roadmap.modules = roadmap.modules.map((m) => ({
      ...m,
      topics: m.topics.sort((a, b) => a.order - b.order),
    }));

    return roadmap;
  }

  async getRoadmapById(id: string) {
    const roadmap = await roadmapRepository.findById(id);
    if (!roadmap) {
      throw new NotFoundError("Roadmap not found.");
    }

    roadmap.modules = roadmap.modules.map((m) => ({
      ...m,
      topics: m.topics.sort((a, b) => a.order - b.order),
    }));

    return roadmap;
  }

  async deleteRoadmap(userId: string) {
    await roadmapRepository.deleteByUserId(userId);
  }
}

export const roadmapService = new RoadmapService();
