import User from "../models/user.model.js";

class UserRepository {
  async getAll() {
    return User.find().select("name email role createdAt").lean();
  }

  async getById(id) {
    return User.findById(id).select("name email role createdAt").lean();
  }

  async getByEmail(email) {
    return User.findOne({ email });
  }

  async create(userData) {
    return User.create(userData);
  }
}

export default new UserRepository();
