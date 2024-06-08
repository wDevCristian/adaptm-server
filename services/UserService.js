import User from "../models/schemas/User.js";
import FileService from "./FileService.js";

const TYPE = "users";

class UserService {
  static async register(user) {
    const newUser = await User.create(user);
    return newUser;
  }

  static async updateById({ user, picture }) {
    const userFound = await User.findByPk(+user.id);
    const oldPictureName = userFound.picture;

    if (oldPictureName !== null) {
      FileService.deletePicture(oldPictureName, TYPE);
    }

    const pictureName = FileService.savePicture(picture, TYPE);
    userFound.picture = pictureName;
    await userFound.save();
  }
}

export default UserService;
