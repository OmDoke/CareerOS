import { userRepository } from "../repositories/user.repository";
import { studySessionService } from "./study-session.service";
import { questionGeneratorService } from "./question-generator.service";
import { questionRepository } from "../repositories/question.repository";
import { telegramProvider } from "../providers/telegram.provider";
import { logger } from "../utils/logger";
import { db } from "../db/database";
import { questionAttempts } from "../db/schema";
import { and, eq } from "drizzle-orm";

export class TelegramStudyService {
  async processHourlyQuestions() {
    logger.info("Starting hourly Telegram Study Q&A processing...");

    // Find all users who have connected Telegram
    const users = await db.query.users.findMany({
      where: (u, { eq }) => eq(u.telegramConnected, true),
      with: {
        roadmap: true,
        resume: true,
      },
    });

    for (const user of users) {
      if (!user.telegramChatId || !user.roadmap || user.roadmap.status !== "ACTIVE") {
        continue;
      }

      try {
        // 1. Check if user already has a PENDING question attempt
        const pendingAttempt = await db.query.questionAttempts.findFirst({
          where: (q, { eq, and }) => and(eq(q.userId, user.id), eq(q.status, "PENDING")),
        });

        if (pendingAttempt) {
          logger.info(`User ${user.id} already has a pending question. Sending reminder.`);
          await telegramProvider.sendMessage(
            user.telegramChatId,
            `⏰ *Reminder*: You have an unanswered question pending! Reply to answer it:\n\n${pendingAttempt.question}`
          );
          continue;
        }

        // 2. No pending question, generate a new one based on today's study session
        let session;
        try {
          session = await studySessionService.generateTodaySession(user.id);
        } catch (e: any) {
          if (e.message.includes("No pending or review topics")) {
            logger.info(`User ${user.id} has finished their roadmap!`);
            continue;
          }
          throw e;
        }

        if (!session) continue;

        // Find the active task
        const activeTask = session.tasks.find((t: any) => t.status === "PENDING") || session.tasks[0];
        if (!activeTask) continue;

        // Fetch context for the question generator
        const previousAttempts = await questionRepository.findRecentSubmitted(user.id, 5);

        // We need current topic and module titles
        let currentModuleTitle = "";
        let currentTopicTitle = activeTask.title;

        // Generate Question
        const generated = await questionGeneratorService.generateQuestion({
          targetRole: user.roadmap.targetRole,
          resumeSummary: user.resume?.aiSummary || "",
          currentModule: currentModuleTitle, // Simplified
          currentTopic: currentTopicTitle,
          previousTopics: [],
          targetDifficulty: "Medium",
          previousAttempts: previousAttempts.map(a => ({
            question: a.question,
            score: a.overallScore,
            status: a.status
          })),
          userId: user.id,
        });

        // 3. Save QuestionAttempt
        const attempt = await questionRepository.createAttempt({
          userId: user.id,
          studySessionId: session.id,
          studyTaskId: activeTask.id,
          topicId: activeTask.topicId,
          question: generated.question,
          difficulty: generated.difficulty,
        });

        // 4. Send to Telegram
        let messageText = `📚 *Hourly Study Time!*\n*Topic*: ${currentTopicTitle}\n\n${generated.question}`;
        
        if (generated.codeSnippet) {
          messageText += `\n\n\`\`\`\n${generated.codeSnippet}\n\`\`\``;
        }
        
        messageText += `\n\n_Reply to this message with your answer!_`;

        await telegramProvider.sendMessage(user.telegramChatId, messageText);
        logger.info(`Sent hourly question to user ${user.id}`);

      } catch (error) {
        logger.error({ err: error, userId: user.id }, "Failed to process hourly question for user");
      }
    }

    logger.info("Finished hourly Telegram Study Q&A processing.");
  }
}

export const telegramStudyService = new TelegramStudyService();
