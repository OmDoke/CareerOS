import { userRepository } from "../repositories/user.repository";
import { questionRepository } from "../repositories/question.repository";

export class AnalyticsService {
  async updateStudyStreak(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) return;

    const now = new Date();
    const lastStudy = user.lastStudyDate;

    let newStreak = user.currentStreak;
    let longestStreak = user.longestStreak;

    if (lastStudy) {
      const diffTime = Math.abs(now.getTime() - lastStudy.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays === 1) {
        // Studied yesterday, increment streak
        newStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        newStreak = 1;
      }
      // If diffDays === 0 (same day), do nothing to streak
    } else {
      // First time studying
      newStreak = 1;
    }

    if (newStreak > longestStreak) {
      longestStreak = newStreak;
    }

    await userRepository.update(userId, {
      currentStreak: newStreak,
      longestStreak: longestStreak,
      lastStudyDate: now,
    });
  }

  async getDashboardAnalytics(userId: string) {
    const user = await userRepository.findById(userId);
    const attempts = await questionRepository.findAttemptsWithTopicByUser(userId);

    const totalAttempts = attempts.length;
    const averageScore = attempts.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / (totalAttempts || 1);
    
    const theoryAttempts = attempts.filter(a => a.questionType === "THEORY");
    const codingAttempts = attempts.filter(a => a.questionType === "CODE");

    const theoryAccuracy = theoryAttempts.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / (theoryAttempts.length || 1);
    const codingAccuracy = codingAttempts.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / (codingAttempts.length || 1);

    return {
      currentStreak: user?.currentStreak || 0,
      longestStreak: user?.longestStreak || 0,
      practiceQuestions: totalAttempts,
      averageScore,
      theoryAccuracy,
      codingAccuracy,
    };
  }

  async getProgressAnalytics(userId: string) {
    const attempts = await questionRepository.findAttemptsByUserSorted(userId);

    // Group by day for weekly/monthly graphs (simplified to just last 7 days)
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const weeklyProgress = last7Days.map(dateStr => {
      const dayAttempts = attempts.filter(a => a.submittedAt?.toISOString().startsWith(dateStr));
      const avgScore = dayAttempts.length ? dayAttempts.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / dayAttempts.length : 0;
      return {
        date: dateStr,
        questionsAnswered: dayAttempts.length,
        averageScore: Math.round(avgScore),
      };
    });

    return {
      weeklyProgress,
      totalStudyTime: attempts.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0),
    };
  }
}

export const analyticsService = new AnalyticsService();
