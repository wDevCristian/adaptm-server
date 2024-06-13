import Event from "../models/schemas/Event.js";
import User from "../models/schemas/User.js";
import { Op } from "sequelize";

class EventUserService {
  static async getAll({ limit, offset }) {
    const events = await Event.findAll({
      where: {
        startDateTime: {
          [Op.gte]: new Date(),
        },
      },
      order: [["startDateTime", "ASC"]],
      include: [{ association: "user", attributes: ["firstname", "lastname"] }],
      attributes: [
        "id",
        "title",
        "startDateTime",
        "picture",
        "maxNrOfParticipants",
      ],
      limit,
      offset,
    });

    return events;
  }
}

export default EventUserService;
