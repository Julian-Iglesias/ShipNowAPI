import userService from "../services/user.service.js";

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();

      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
