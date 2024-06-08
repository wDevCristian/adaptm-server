import ApiError from "../error/apiError.js";
import UserService from "../services/UserService.js";

class UserController {
  static async register(req, res, next) {
    try {
      const result = await UserService.register(req.body);
      res.json(result);
    } catch (error) {
      // return next(ApiError.badRequest(error.message));
      res.status(500).json(error.errors.map((i) => i.message));
    }
  }

  static async login(req, res) {
    res.json({ message: "Successfully received..." });
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
}

export default UserController;
