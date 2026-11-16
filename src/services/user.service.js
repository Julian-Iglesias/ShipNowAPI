import userRepository from "../repositories/user.repository.js";
import { USER_ROLES } from "../constants/index.js";
import AppError from "../utils/AppError.js";

class UserService {
  async getAll() {
    return userRepository.getAll();
  }

  async getById(id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new AppError("El ID del usuario no es válido", 400);
    }

    const user = await userRepository.getById(id);

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return user;
  }

  async create(userData) {
    const { name, email } = userData ?? {};

    // Validamos el nombre
    if (typeof name !== "string" || !name.trim()) {
      throw new AppError("El nombre es obligatorio", 400);
    }

    // Validamos el email
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      throw new AppError("El email no es válido", 400);
    }

    // Normalizamos el email
    const normalizedEmail = email.trim().toLowerCase();

    // Comprobamos si ya existe
    const existingUser = await userRepository.getByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppError("El email ya está registrado", 409);
    }

    // Creamos el usuario con el rol permitido
    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      role: USER_ROLES.USER,
    };

    try {
      return await userRepository.create(newUser);
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("El email ya está registrado", 409);
      }

      throw error;
    }
  }
}

export default new UserService();
