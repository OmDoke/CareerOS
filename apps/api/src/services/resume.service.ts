import { resumeRepository } from "../repositories/resume.repository";
import { NotFoundError, BadRequestError } from "../errors/custom-errors";
import fs from "fs";
import path from "path";
// pdf-parse v2 exports a class-based API
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PDFParse } = require("pdf-parse");
import { z } from "zod";
import { updateResumeSchema } from "../validators/update-resume.schema";

type UpdateResumeInput = z.infer<typeof updateResumeSchema>["body"];

export class ResumeService {
  async uploadResume(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    const hasResume = await resumeRepository.exists(userId);

    // Save file metadata
    const mimeType = file.mimetype;
    const fileSize = file.size;
    const originalFileName = file.originalname;
    const storedFileName = file.filename;

    if (hasResume) {
      // Delete old file physically
      const existingResume = await resumeRepository.findByUserId(userId);
      if (existingResume) {
        const oldFilePath = path.join(process.cwd(), "uploads", "resumes", existingResume.storedFileName);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
        await resumeRepository.delete(userId);
      }
    }

    // Create Resume Record
    const resume = await resumeRepository.create({
      user: { connect: { id: userId } },
      originalFileName,
      storedFileName,
      fileSize,
      mimeType,
      status: "UPLOADED",
    });

    // Parse PDF
    let extractedText = null;
    let pageCount = null;
    let parseStatus = "SUCCESS";
    let parseError = null;
    let finalStatus = "PARSED";

    try {
      // pdf-parse v2 wraps pdfjs-dist getDocument() — pass the file path as `url`
      const parser = new PDFParse({ url: file.path });
      const result = await parser.getText();
      extractedText = result.pages.map((p: { text: string }) => p.text).join("\n");
      pageCount = result.pages.length;
    } catch (err) {
      parseStatus = "ERROR";
      parseError = err instanceof Error ? err.message : "Unknown parsing error";
      finalStatus = "UPLOADED"; // Failed to parse
      console.error("Failed to parse PDF:", err);
    }

    // Save Extracted Text & Update Status
    const updatedResume = await resumeRepository.update(userId, {
      extractedText,
      pageCount,
      parseStatus,
      parseError,
      status: finalStatus,
    });

    return updatedResume;
  }

  async getResume(userId: string) {
    const resume = await resumeRepository.findByUserId(userId);
    if (!resume) {
      throw new NotFoundError("Resume not found");
    }
    return resume;
  }

  async getResumeFile(userId: string) {
    const resume = await resumeRepository.findByUserId(userId);
    if (!resume) {
      throw new NotFoundError("Resume not found");
    }
    const filePath = path.join(process.cwd(), "uploads", "resumes", resume.storedFileName);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundError("Resume file not found on disk");
    }
    return { filePath, originalFileName: resume.originalFileName };
  }

  async updateResume(userId: string, data: UpdateResumeInput) {
    const hasResume = await resumeRepository.exists(userId);
    if (!hasResume) {
      throw new NotFoundError("Resume not found");
    }
    return resumeRepository.update(userId, data);
  }

  async deleteResume(userId: string) {
    const resume = await resumeRepository.findByUserId(userId);
    if (!resume) {
      throw new NotFoundError("Resume not found");
    }

    const filePath = path.join(process.cwd(), "uploads", "resumes", resume.storedFileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await resumeRepository.delete(userId);
    return true;
  }
}

export const resumeService = new ResumeService();
