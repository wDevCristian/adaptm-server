import Event from "../models/schemas/Event.js";
import User from "../models/schemas/User.js";
import EventType from "../models/schemas/EventType.js";
import { Op } from "sequelize";
import sequelize from "../db.js";

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

  static async getEventDetailsById(id) {
    const event = await Event.findByPk(id, {
      include: [
        {
          association: "user",
          attributes: ["firstname", "lastname", "picture"],
        },
      ],
    });

    const eventType = await this.__getEventTypesByEventId(event.id);
    const typesArr = eventType.map((i) => i.type);

    const userParticipateEvent =
      await sequelize.models.user_participate_event.count({
        where: {
          eventId: event.id,
        },
      });

    return {
      ...event.dataValues,
      type: typesArr,
      participants: userParticipateEvent + 1,
    };
  }

  static async __getEventTypesByEventId(eventId) {
    const result = await EventType.findAll({
      where: { eventId },
    });

    return result;
  }
}

export default EventUserService;
