import { prisma } from "../database";

export class MasteryService {
  async calculateTopicMastery(topicId: string): Promise<number> {
    const attempts = await prisma.questionAttempt.findMany({
      where: { topicId, status: "SUBMITTED" },
      orderBy: { submittedAt: "asc" }
    });

    if (attempts.length === 0) return 0;

    let totalWeight = 0;
    let weightedScore = 0;

    attempts.forEach((attempt, index) => {
      // Recent attempts get higher weights
      const weight = index + 1;
      let score = attempt.overallScore || 0;
      
      // Penalize hint usage
      if (attempt.hintCount > 0) {
        score -= attempt.hintCount * 10;
      }
      
      // Adjust based on difficulty
      if (attempt.difficulty === "Intermediate") score += 5;
      if (attempt.difficulty === "Advanced") score += 10;
      
      // Ensure score stays within 0-100 bounds for the calculation
      score = Math.max(0, Math.min(100, score));
      
      weightedScore += score * weight;
      totalWeight += weight;
    });

    const mastery = Math.round(weightedScore / totalWeight);

    return Math.min(100, Math.max(0, mastery));
  }

  async updateTopicMastery(topicId: string): Promise<number> {
    const mastery = await this.calculateTopicMastery(topicId);
    
    await prisma.roadmapTopic.update({
      where: { id: topicId },
      data: { masteryPercentage: mastery }
    });
    
    return mastery;
  }
}

export const masteryService = new MasteryService();
