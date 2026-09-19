import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import { NotFoundError, UnauthorizedError } from "../errors/custom-errors";
import { z } from "zod";
import { updateProfileSchema, changePasswordSchema } from "../validators/user.schema";

type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];

export class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    
    // Check if user has uploaded a resume
    const { resumeRepository } = await import("../repositories/resume.repository");
    const resume = await resumeRepository.findByUserId(userId);
    
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      hasResume: !!resume,
      resumeStatus: resume?.status || null
    };
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await userRepository.update(userId, data);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isValidPassword = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Incorrect current password");
    }

    const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);
    await userRepository.update(userId, { password: hashedNewPassword });
  }
}

export const userService = new UserService();
