import { studySessionRepository } from "../repositories/study-session.repository";
import { roadmapRepository } from "../repositories/roadmap.repository";
import { NotFoundError, BadRequestError } from "../errors/custom-errors";

export class StudySessionService {
  async generateTodaySession(userId: string) {
    // Check if session already exists for today
    const existingSession = await studySessionRepository.findTodaySession(userId);
    if (existingSession) {
      return existingSession;
    }

    // Find active roadmap
    const roadmap = await roadmapRepository.findByUserId(userId);
    if (!roadmap || roadmap.status !== "ACTIVE") {
      throw new BadRequestError("No active roadmap found to generate a study session.");
    }

    // Find the first module that has pending topics
    let currentModule: (typeof roadmap.modules)[0] | null = null;
    let pendingTopics: (typeof roadmap.modules)[0]["topics"] = [];

    for (const module of roadmap.modules) {
      const unfinished = module.topics.filter(t => t.status === "PENDING");
      if (unfinished.length > 0) {
        currentModule = module;
        pendingTopics = unfinished.sort((a, b) => a.order - b.order);
        break;
      }
    }

    if (!currentModule || pendingTopics.length === 0) {
      throw new BadRequestError("No pending topics found in the roadmap. You have completed everything!");
    }

    // Select topics (up to 3 or roughly 60 mins)
    const selectedTopics = [];
    let totalMinutes = 0;
    for (const topic of pendingTopics) {
      selectedTopics.push(topic);
      totalMinutes += topic.estimatedMinutes || 30; // default 30 min if missing
      
      if (selectedTopics.length >= 3 || totalMinutes >= 60) {
        break;
      }
    }

    // Construct tasks
    const tasks = selectedTopics.map((topic, i) => ({
      topicId: topic.id,
      order: i + 1,
      title: topic.title,
      estimatedMinutes: topic.estimatedMinutes || 30,
    }));

    // Create session (defaulting to 5 total questions for future question generation)
    const newSession = await studySessionRepository.create(
      userId,
      roadmap.id,
      currentModule.id,
      totalMinutes,
      5, // default questions
      tasks
    );

    return newSession;
  }

  async getTodaySession(userId: string) {
    return studySessionRepository.findTodaySession(userId);
  }

  async getHistory(userId: string) {
    return studySessionRepository.findHistory(userId);
  }

  async completeSession(userId: string, sessionId: string) {
    const session = await studySessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundError("Session not found");
    }
    if (session.userId !== userId) {
      throw new BadRequestError("Unauthorized to complete this session");
    }
    if (session.status === "COMPLETED") {
      return session; // already done
    }

    return studySessionRepository.completeSession(sessionId);
  }
}

export const studySessionService = new StudySessionService();
