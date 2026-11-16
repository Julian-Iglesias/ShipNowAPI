import userService from "../services/user.service.js";

class UserController {
  async getAll(req, res) {
    try {
      const users = await userService.getAll();

      return res.status(200).json({
        status: "success",
        data: users,
      });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);

      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async create(req, res) {
    try {
      const user = await userService.create(req.body);

      return res.status(201).json({
        status: "success",
        message: "Usuario creado correctamente",
        data: user,
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);

      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        status: "error",
        message:
          statusCode === 500 ? "Error interno del servidor" : error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.getById(id);

      return res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      console.error("Error al obtener usuario:", error);

      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        status: "error",
        message:
          statusCode === 500 ? "Error interno del servidor" : error.message,
      });
    }
  }
}

export default new UserController();
