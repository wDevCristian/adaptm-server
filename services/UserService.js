import User from "../models/schemas/User.js";

class UserService {
  static async register(user) {
    const newUser = await User.create(user);
    return newUser;
  }
}

export default UserService;
