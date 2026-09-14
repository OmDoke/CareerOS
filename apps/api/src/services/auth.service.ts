import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository";
import { ConflictError, UnauthorizedError, BadRequestError } from "../errors/custom-errors";
import { env } from "../config/env";
import { z } from "zod";
import { registerSchema, loginSchema } from "../validators/auth.schema";

type RegisterInput = z.infer<typeof registerSchema>["body"];
type LoginInput = z.infer<typeof loginSchema>["body"];

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginInput) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      accessToken: token,
      user: userWithoutPassword,
    };
  }
}

export const authService = new AuthService();
