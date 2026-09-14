import { prisma } from "../database";
import { Prisma } from "@prisma/client";

export class ResumeRepository {
  async create(data: Prisma.ResumeCreateInput) {
    return prisma.resume.create({ data });
  }

  async findByUserId(userId: string) {
    return prisma.resume.findUnique({ where: { userId } });
  }

  async update(userId: string, data: Prisma.ResumeUpdateInput) {
    return prisma.resume.update({ where: { userId }, data });
  }

  async delete(userId: string) {
    return prisma.resume.delete({ where: { userId } });
  }

  async exists(userId: string) {
    const count = await prisma.resume.count({ where: { userId } });
    return count > 0;
  }
}

export const resumeRepository = new ResumeRepository();
