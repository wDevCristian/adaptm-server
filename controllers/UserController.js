import ApiError from "../error/apiError.js";
import UserService from "../services/UserService.js";

class UserController {
  static async register(req, res, next) {
    try {
      const result = await UserService.register(req.body);
      res.json(result);
    } catch (error) {
      return next(ApiError.badRequest(error.errors.map((i) => i.message)));
    }
  }

  static async login(req, res) {
    res.json({ message: "Successfully received..." });
  }

  static async getById(req, res, next) {
    try {
      const id = req.params.id;

      if (!id) {
        throw Error("ID not provided");
      }

      const user = await UserService.getOrganizerFullnameById(id);
      res.json(user);
    } catch (error) {
      next(ApiError.badRequest("ID not provided"));
    }
  }

  static async check(req, res, next) {
    const { id } = req.query;
    const params = req.params;
    console.log(params);

    if (!id) {
      return next(ApiError.badRequest("Not provided id"));
    }

    res.json(id);
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
