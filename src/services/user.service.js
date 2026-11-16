import userRepository from "../repositories/user.repository.js";
import { USER_ROLES } from "../constants/index.js";
import AppError from "../utils/AppError.js";

class UserService {
  async getAll() {
    return userRepository.getAll();
  }

  async getById(id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new AppError("INVALID_USER_ID");
    }

    const user = await userRepository.getById(id);

    if (!user) {
      throw new AppError("USER_NOT_FOUND");
    }

    return user;
  }

  async create(userData) {
    const { name, email } = userData ?? {};

    if (typeof name !== "string" || !name.trim()) {
      throw new AppError("INVALID_USER_NAME");
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      throw new AppError("INVALID_USER_EMAIL");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userRepository.getByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppError("DUPLICATE_EMAIL");
    }

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      role: USER_ROLES.USER,
    };

    try {
      return await userRepository.create(newUser);
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("DUPLICATE_EMAIL");
      }

      throw error;
    }
  }
}

export default new UserService();
