import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/schemas/User.js";
import FileService from "./FileService.js";
import ApiError from "../error/apiError.js";

const TYPE = "users";

class UserService {
  static async register(user) {
    const hashedPassword = await bcrypt.hash(
      user.password,
      +process.env.PASSWORD_SALT
    );

    const newUser = await User.create({
      email: user.email,
      password: hashedPassword,
      firstname: user.firstname,
      lastname: user.lastname,
    });

    const payload = {
      id: newUser.id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      picture: newUser.picture,
    };

    const token = UserService.generateToken(payload);

    return { token };
  }

  static async login(user) {
    const userFound = await User.findOne({ where: { email: user.email } });

    if (!userFound) {
      throw ApiError.unauthorized("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(
      user.password,
      userFound.password
    );

    if (!isPasswordCorrect) {
      throw ApiError.unauthorized("Wrong password");
    }

    const payload = {
      id: userFound.id,
      firstname: userFound.firstname,
      lastname: userFound.lastname,
      email: userFound.email,
      picture: userFound.picture,
    };

    const token = UserService.generateToken(payload);

    return { token };
  }

  static generateToken(payload) {
    console.log(payload);

    const token = jwt.sign(
      {
        id: payload.id,
        firstname: payload.firstname,
        lastname: payload.lastname,
        email: payload.email,
        picture: payload.picture,
      },
      process.env.JWT_CRYPTO_KEY,
      { expiresIn: "1h" }
    );

    return token;
  }

  static async getByEmail(email) {
    const userFound = await User.findOne({ where: { email } });
    return userFound;
  }

  static async getOrganizerFullnameById(id) {
    const userFound = await User.findByPk(id);
    return { firstname: userFound.firstname, lastname: userFound.lastname };
  }

  static async updateById({ user, picture }) {
    const userFound = await this.getById(+user.id);
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
