import { db } from "../db/database";
import { telegramProvider } from "../providers/telegram.provider";
import { logger } from "../utils/logger";
import { resumeTailorService } from "./resume-tailor.service";

export class JobNotificationService {
  async fetchJobsForUser(url: string, location: string) {
    try {
      // Use the user's configured URL or fallback to Arbeitnow
      const fetchUrl = url || "https://www.arbeitnow.com/api/job-board-api";
      const response = await fetch(fetchUrl);
      const data = await response.json();
      
      // Handle different standard API response formats (Arbeitnow vs RapidAPI)
      let jobs = data.data || data.jobs || data.results || [];
      
      // Filter by multi-select locations (e.g., "remote,pune")
      if (location) {
        const targetLocations = location.toLowerCase().split(",").map(l => l.trim());
        
        jobs = jobs.filter((j: any) => {
          const jobLoc = (j.location || "").toLowerCase();
          const jobTitle = (j.title || "").toLowerCase();
          
          // Keep the job if it matches AT LEAST ONE of the selected locations
          return targetLocations.some(loc => 
            jobLoc.includes(loc) || jobTitle.includes(loc)
          );
        });
      }
      
      return jobs; 
    } catch (error) {
      logger.error({ err: error }, "Failed to fetch jobs from API");
      return [];
    }
  }

  async processDailyJobAlerts(targetUserId?: string) {
    logger.info(`Starting Job Notification processing${targetUserId ? ' for user ' + targetUserId : ''}...`);

    const users = await db.query.users.findMany({
      where: (u, { eq, and }) => targetUserId 
        ? and(eq(u.telegramConnected, true), eq(u.id, targetUserId))
        : eq(u.telegramConnected, true),
      with: {
        roadmap: true,
        resume: true, // Fetch user resume for keywords
      },
    });

    if (users.length === 0) {
      logger.info(targetUserId ? `User ${targetUserId} not found or not connected.` : "No users with Telegram connected for job alerts.");
      return { success: false, message: "No matching users found or you are not connected." };
    }

    let totalMatches = 0;

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

        // Generate tailored resume for the best matching job
        if (matchedJobs.length > 0) {
          const topJob = matchedJobs[0];
          try {
            await telegramProvider.sendMessage(user.telegramChatId, `🤖 Generating a tailored AI cover letter and resume for the top match: *${topJob.title}*...`);
            
            const jobDescription = `${topJob.title} - ${topJob.description || ""}`;
            const tailoredData = await resumeTailorService.tailorResume(user.id, jobDescription);
            
            // Generate PDF Buffer
            const personalInfo = {
              name: user.resume?.name || 'Candidate',
              title: role,
              email: user.resume?.email || user.email,
              phone: user.resume?.phone || ''
            };
            
            const pdfBuffer = await resumeTailorService.generatePdfBuffer(personalInfo, tailoredData);
            
            // Send the tailored cover letter (summary) + PDF
            let letterMsg = `🎯 *Tailored Cover Letter for ${topJob.company_name}*\n\n`;
            letterMsg += `*Summary:*\n${tailoredData.tailoredSummary}\n\n`;
            letterMsg += `*Match Score:* ${tailoredData.matchScore}%\n`;
            if (tailoredData.missingKeywords && tailoredData.missingKeywords.length > 0) {
              letterMsg += `*Missing Keywords:* ${tailoredData.missingKeywords.join(", ")}\n`;
            }

            await telegramProvider.sendMessage(user.telegramChatId, letterMsg);
            
            // Provide PDF via generic document send method of node-telegram-bot-api
            const bot = telegramProvider.getBot();
            if (bot) {
              await bot.sendDocument(user.telegramChatId, pdfBuffer, {}, {
                filename: 'Tailored_Resume.pdf',
                contentType: 'application/pdf'
              });
            }
          } catch (pdfError) {
            logger.error({ err: pdfError, userId: user.id }, "Failed to generate and send tailored PDF");
            await telegramProvider.sendMessage(user.telegramChatId, "❌ Failed to generate tailored PDF. Please check your resume analysis status.");
          }
        }

        logger.info(`Sent job notification to user ${user.id}`);
        totalMatches++;
      } catch (error) {
        logger.error({ err: error, userId: user.id }, "Failed to send job notification to user");
      }
    }

    logger.info("Finished Job Notification processing.");
    return { 
      success: true, 
      message: totalMatches > 0 ? `Found and sent matches for ${totalMatches} users.` : "No jobs matched your skills today." 
    };
  }
}

export const jobNotificationService = new JobNotificationService();
