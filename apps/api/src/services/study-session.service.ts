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

    // 1. Review Due
    const now = new Date();
    const allTopics = roadmap.modules.flatMap(m => m.topics);
    const reviewDue = allTopics.filter(t => t.nextReviewDate && t.nextReviewDate <= now && t.status !== "PENDING");
    
    // 2. Weakest Topics (Mastery < 50)
    const weakTopics = allTopics.filter(t => t.masteryPercentage < 50 && t.status !== "PENDING" && !reviewDue.includes(t));
    weakTopics.sort((a, b) => a.masteryPercentage - b.masteryPercentage);

    // 3. New Topics
    const newTopics = allTopics.filter(t => t.status === "PENDING").sort((a, b) => {
      // Sort by module order, then topic order
      const modA = roadmap.modules.find(m => m.id === a.moduleId)!;
      const modB = roadmap.modules.find(m => m.id === b.moduleId)!;
      if (modA.order !== modB.order) return modA.order - modB.order;
      return a.order - b.order;
    });

    // Select topics to fill ~60 minutes
    const selectedTopics: any[] = [];
    let totalMinutes = 0;

    const addTopic = (topic: any) => {
      if (totalMinutes >= 60) return false;
      if (selectedTopics.find(t => t.id === topic.id)) return true;
      selectedTopics.push(topic);
      totalMinutes += topic.estimatedMinutes || 30;
      return true;
    };

    // Pick 1 review if available
    if (reviewDue.length > 0) addTopic(reviewDue[0]);
    // Pick 1 weak if available
    if (weakTopics.length > 0) addTopic(weakTopics[0]);
    // Fill rest with new topics
    for (const nt of newTopics) {
      if (!addTopic(nt)) break;
    }
    // If still have time, fill with more reviews
    for (const rt of reviewDue) {
      if (!addTopic(rt)) break;
    }

    if (selectedTopics.length === 0) {
      throw new BadRequestError("No pending or review topics found. You have completed everything!");
    }

    // Determine currentModule (from the first new topic, or fallback to first selected)
    const activeTopic = selectedTopics.find(t => t.status === "PENDING") || selectedTopics[0];
    const currentModule = roadmap.modules.find(m => m.id === activeTopic.moduleId)!;

    // Construct tasks
    const tasks = selectedTopics.map((topic, i) => ({
      topicId: topic.id,
      order: i + 1,
      title: topic.title,
      estimatedMinutes: topic.estimatedMinutes || 30,
    }));

    // Create session
    const newSession = await studySessionRepository.create(
      userId,
      roadmap.id,
      currentModule.id,
      totalMinutes,
      selectedTopics.length * 2, // e.g. 2 questions per topic
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
