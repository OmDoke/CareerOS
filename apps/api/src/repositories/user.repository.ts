import { prisma } from "../database";
import { Prisma } from "@prisma/client";

export class UserRepository {
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }
}

export const userRepository = new UserRepository();
