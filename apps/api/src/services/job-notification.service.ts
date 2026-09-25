import { db } from "../db/database";
import { telegramProvider } from "../providers/telegram.provider";
import { logger } from "../utils/logger";

export class JobNotificationService {
  async fetchJobsForUser(url: string, location: string) {
    try {
      // Use the user's configured URL or fallback to Arbeitnow
      const fetchUrl = url || "https://www.arbeitnow.com/api/job-board-api";
      const response = await fetch(fetchUrl);
      const data = await response.json();
      
      // Handle different standard API response formats (Arbeitnow vs RapidAPI)
      let jobs = data.data || data.jobs || data.results || [];
      
      // If a specific location is set and it's not remote, try to pre-filter
      if (location && location.toLowerCase() !== "remote") {
        jobs = jobs.filter((j: any) => 
          (j.location && j.location.toLowerCase().includes(location.toLowerCase())) ||
          (j.title && j.title.toLowerCase().includes(location.toLowerCase()))
        );
      }
      
      return jobs; 
    } catch (error) {
      logger.error({ err: error }, "Failed to fetch jobs from API");
      return [];
    }
  }

  async processDailyJobAlerts() {
    logger.info("Starting daily Job Notification processing...");

    const users = await db.query.users.findMany({
      where: (u, { eq }) => eq(u.telegramConnected, true),
      with: {
        roadmap: true,
        resume: true, // Fetch user resume for keywords
      },
    });

    if (users.length === 0) {
      logger.info("No users with Telegram connected for job alerts.");
      return;
    }

    for (const user of users) {
      if (!user.telegramChatId) continue;

      try {
        // Fetch jobs using this user's specific scraper config
        const jobs = await this.fetchJobsForUser(user.jobScraperUrl || "", user.jobScraperLocation || "");
        if (jobs.length === 0) {
           continue;
        }

        // 1. Extract Keywords from User's Resume
        let keywords: string[] = ["react", "node", "next", "java", "python"]; // Default fallbacks
        if (user.resume?.skills) {
          keywords = user.resume.skills.toLowerCase().split(",").map(k => k.trim());
        }

        // 2. Filter jobs based on Resume Keywords
        const matchedJobs = jobs.filter((job: any) => {
          const jobText = `${job.title} ${job.description || ""} ${job.tags?.join(" ") || ""}`.toLowerCase();
          // Match if AT LEAST ONE resume skill is in the job text
          return keywords.some(keyword => keyword.length > 2 && jobText.includes(keyword));
        }).slice(0, 5); // Take top 5 matching jobs

        if (matchedJobs.length === 0) {
          logger.info(`No jobs matched for user ${user.id} today.`);
          continue;
        }

        let jobMessage = `🚀 *Daily Match based on your Resume*\n\n`;
        matchedJobs.forEach((job: any) => {
          jobMessage += `*${job.title || 'Job'}* at _${job.company_name || 'Company'}_\n`;
          if (job.location) jobMessage += `📍 Location: ${job.location}\n`;
          jobMessage += `🔗 [Apply Here](${job.url || '#'})\n\n`;
        });

        const role = user.roadmap?.targetRole || "Software Engineer";
        const personalizedMsg = `Hi! I found jobs matching the skills in your resume (*${keywords.slice(0,4).join(", ")}...*) for a *${role}*:\n\n` + jobMessage;
        
        await telegramProvider.sendMessage(user.telegramChatId, personalizedMsg, { disable_web_page_preview: true });
        logger.info(`Sent job notification to user ${user.id}`);
      } catch (error) {
        logger.error({ err: error, userId: user.id }, "Failed to send job notification to user");
      }
    }

    logger.info("Finished daily Job Notification processing.");
  }
}

export const jobNotificationService = new JobNotificationService();
