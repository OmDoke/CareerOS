import { prisma } from "../database";

export class ReviewService {
  async scheduleNextReview(topicId: string, masteryPercentage: number): Promise<Date> {
    const now = new Date();
    let daysToAdd = 1;

    if (masteryPercentage >= 90) {
      daysToAdd = 14;
    } else if (masteryPercentage >= 80) {
      daysToAdd = 7;
    } else if (masteryPercentage >= 60) {
      daysToAdd = 3;
    } else {
      daysToAdd = 1;
    }

    const nextReviewDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    await prisma.roadmapTopic.update({
      where: { id: topicId },
      data: { 
        nextReviewDate,
        lastAttemptDate: now
      }
    });

    return nextReviewDate;
  }
}

export const reviewService = new ReviewService();
