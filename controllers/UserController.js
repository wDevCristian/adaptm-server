import ApiError from "../error/apiError.js";
import UserService from "../services/UserService.js";

class UserController {
  static async register(req, res, next) {
    try {
      console.log(req.body);

      const { email, password, firstname, lastname } = req.body;

      // TODO: in-depth validation
      // check if email is provided
      if (!email) {
        return next(ApiError.badRequest("Email not provided"));
      }
      // check if password is provided
      if (!password) {
        return next(ApiError.badRequest("Password not provided"));
      }
      // check if  is provided
      if (!firstname) {
        return next(ApiError.badRequest("Firstname not provided"));
      }
      // check if  is provided
      if (!lastname) {
        return next(ApiError.badRequest("Lastname not provided"));
      }

      // check if user exists
      const candidate = await UserService.getByEmail(email);
      if (candidate) {
        return next(ApiError.badRequest("User already exists"));
      }

      const resObj = await UserService.register({
        email,
        password,
        firstname,
        lastname,
      });

      res.json(resObj);
    } catch (error) {
      console.log(error);
      return next(ApiError.internalServerError(error));
    }
  }

  static async login(req, res, next) {
    try {
      console.log(req.body);
      const { email, password } = req.body;

      // check if email is provided
      if (!email) {
        return next(ApiError.badRequest("Email not provided"));
      }

      // check if password is provided
      if (!password) {
        return next(ApiError.badRequest("Password not provided"));
      }

      const resObj = await UserService.login({ email, password });

      res.json(resObj);
    } catch (error) {
      return next(ApiError.unauthorized(error));
    }
  }

  static async getById(req, res, next) {
    try {
      const id = req.params.id;

      if (!id) {
        throw Error("ID not provided");
      }

      const user = await UserService.getById(id);
      res.json(user);
    } catch (error) {
      next(ApiError.badRequest("ID not provided"));
    }
  }

  static async check(req, res, next) {
    const token = UserService.generateToken({
      id: req.user.id,
      email: req.user.email,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      picture: req.user.picture,
    });

    res.json({ token });
  }

  // TODO: add implementation for lastname, firstname, password update
  static async update(req, res, next) {
    try {
      const user = req.body;

      if (!user.id) {
        throw Error("ID not provided");
      }

      let picture = null;
      if (req.files !== null) {
        picture = req.files.picture;
      }

      if (picture !== null) {
        await UserService.updateById({ user, picture });
      }
      res.json({ message: "Successfully updated" });
    } catch (error) {
      return next(ApiError.internalServerError(error));
    }
  }
}

export default UserController;
