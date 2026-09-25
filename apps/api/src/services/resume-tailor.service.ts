import { getResumeTailorPrompt } from "../prompts/resume-tailor.prompt";
import { aiProviderService } from "./ai-provider.service";
import { resumeRepository } from "../repositories/resume.repository";
import { NotFoundError, BadRequestError, AppError } from "../errors/custom-errors";
import { logger } from "../utils/logger";
import { z } from "zod";
const PdfPrinter = require('pdfmake');

const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};
const printer = new PdfPrinter(fonts);

const TailoredResumeSchema = z.object({
  tailoredSummary: z.string(),
  tailoredSkills: z.array(z.string()),
  tailoredExperience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      duration: z.string(),
      points: z.array(z.string()),
    })
  ),
  matchScore: z.number(),
  missingKeywords: z.array(z.string()),
});

export class ResumeTailorService {
  async tailorResume(userId: string, jobDescription: string) {
    const resume = await resumeRepository.findByUserId(userId);
    
    if (!resume) {
      throw new NotFoundError("Resume not found. Please upload and analyze a resume first.");
    }

    if (resume.status !== "ANALYZED" || !resume.skills || !resume.experience) {
      throw new BadRequestError("Resume must be analyzed by AI first before tailoring.");
    }

    try {
      // Reconstruct a clean JSON version of the candidate's base resume
      const baseResume = {
        name: resume.name,
        email: resume.email,
        phone: resume.phone,
        summary: resume.aiSummary,
        skills: JSON.parse(resume.skills as string),
        experience: JSON.parse(resume.experience as string),
        education: resume.education ? JSON.parse(resume.education as string) : [],
        projects: resume.projects ? JSON.parse(resume.projects as string) : [],
      };

      const prompt = getResumeTailorPrompt(JSON.stringify(baseResume, null, 2), jobDescription);
      
      const { provider } = await aiProviderService.getProviderForUser(userId);
      
      // Attempt generation with a retry block
      let rawJson;
      try {
        rawJson = await provider.generateJSON(prompt, "gemini-3.6-flash");
      } catch (e) {
        logger.warn("First attempt at resume tailoring failed, retrying once...");
        rawJson = await provider.generateJSON(prompt, "gemini-3.6-flash");
      }

      // Validate strict schema
      const validatedData = TailoredResumeSchema.parse(rawJson);
      
      return validatedData;

    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error({ err: error, userId }, "Failed to validate tailored resume JSON from Gemini");
        throw new AppError("AI generated invalid resume structure. Please try again.", 502);
      }
      logger.error({ err: error, userId }, "Failed to tailor resume");
      throw new AppError("Failed to tailor resume with AI.", 500);
    }
  }

  async generatePdfBuffer(personalInfo: any, tailoredData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const docDefinition = {
          content: [
            { text: personalInfo.name || 'Candidate', style: 'header' },
            { text: `${personalInfo.title || 'Professional'} | ${personalInfo.email || ''} | ${personalInfo.phone || ''}\n\n`, style: 'subheader' },
            
            { text: 'PROFESSIONAL SUMMARY', style: 'sectionHeader' },
            { text: `${tailoredData.tailoredSummary}\n\n`, style: 'body' },

            { text: 'TECHNICAL SKILLS', style: 'sectionHeader' },
            {
              ul: tailoredData.tailoredSkills
            },
            { text: '\n' },

            { text: 'EXPERIENCE', style: 'sectionHeader' },
            ...tailoredData.tailoredExperience.flatMap((exp: any) => [
              { text: `${exp.title} - ${exp.company}`, style: 'jobTitle' },
              { text: exp.duration, style: 'date' },
              { ul: exp.points },
              { text: '\n' }
            ])
          ],
          styles: {
            header: {
              fontSize: 22,
              bold: true,
              alignment: 'center' as const,
              margin: [0, 0, 0, 5] as [number, number, number, number]
            },
            subheader: {
              fontSize: 12,
              alignment: 'center' as const,
              color: 'gray'
            },
            sectionHeader: {
              fontSize: 14,
              bold: true,
              color: '#2C3E50',
              margin: [0, 15, 0, 5] as [number, number, number, number],
              decoration: 'underline' as const
            },
            body: {
              fontSize: 10,
              lineHeight: 1.5
            },
            jobTitle: {
              fontSize: 12,
              bold: true,
              margin: [0, 5, 0, 2] as [number, number, number, number]
            },
            date: {
              fontSize: 10,
              color: 'gray',
              italics: true,
              margin: [0, 0, 0, 5] as [number, number, number, number]
            }
          },
          defaultStyle: {
            font: 'Roboto',
            fontSize: 10
          }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        
        const chunks: Buffer[] = [];
        pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', (err: any) => reject(err));
        
        pdfDoc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const resumeTailorService = new ResumeTailorService();
