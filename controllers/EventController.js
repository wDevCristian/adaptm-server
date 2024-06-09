import ApiError from "../error/apiError.js";
import EventService from "../services/EventService.js";

class EventController {
  static async create(req, res, next) {
    try {
      let picture = req?.files?.picture || null;
      let textDate = req.body;
      let result;

      if (picture === null) {
        result = await EventService.create({ ...textDate });
      } else {
        result = await EventService.create({ picture, ...textDate });
      }

      res.json({ message: "Event created successfully", result });
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error);
      // return next(ApiError.badRequest(error));
    }
  }
  static async getAll(req, res) {
    try {
      let { limit, page } = req.query;
      limit = limit || 16;
      page = page || 1;
      let offset = (page - 1) * limit;

      const result = await EventService.getAll({ limit, offset });

      res.json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getById(req, res) {
    res.json({ message: "Successfully send event by ID..." });
  }

  static async deleteById(req, res) {
    res.json({ message: "Successfully deleted..." });
  }

  static async updateById(req, res) {
    res.json({ message: "Successfully updated..." });
  }
}

export default EventController;
