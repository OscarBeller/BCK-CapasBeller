import { usersModel } from "./models/userModel.js";

export class UserManagerMongoDAO {
  async create(user) {
    return await usersModel.create(user);
  }

  async getBy(filter) {
    return await usersModel.findOne(filter).lean();
  }
}
