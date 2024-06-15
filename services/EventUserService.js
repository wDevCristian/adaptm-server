import Event from "../models/schemas/Event.js";
import User from "../models/schemas/User.js";
import EventType from "../models/schemas/EventType.js";
import { Op } from "sequelize";
import sequelize from "../db.js";
import UserService from "./UserService.js";

class EventUserService {
  static async createSavedEvent(userId, eventId) {
    await sequelize.models.user_save_event.create({
      userId,
      eventId,
    });
  }

  static async getSavedEventsByUserId(userId) {
    const resultEvents = await this._getEventsSavedByUserDbObject(userId);
    const savedEvents = resultEvents[0].events;
    let result = [];

    for (let i = 0; i < savedEvents.length; i++) {
      let val = await this._getParticipantsToEventByEventId(savedEvents[i].id);
      let userData = await UserService.getOrganizerFullnameById(
        savedEvents[i].organizerId
      );
      console.log(val);
      result.push({
        ...savedEvents[i].dataValues,
        participants: val,
        user: userData,
      });
    }

    return result;
  }

  static async _getEventsSavedByUserDbObject(userId) {
    const events = await User.findAll({
      include: { model: Event },
      where: { id: userId },
      attributes: ["id", "firstname", "lastname"],
    });

    return events;
  }

  static async getAll({ limit, offset }) {
    const events = await Event.findAll({
      where: {
        startDateTime: {
          [Op.gte]: new Date(),
        },
      },
      order: [["startDateTime", "ASC"]],
      include: [
        { association: "user", attributes: ["id", "firstname", "lastname"] },
      ],
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
          attributes: ["id", "firstname", "lastname", "picture"],
        },
      ],
    });

    const eventType = await this.__getEventTypesByEventId(event.id);
    const typesArr = eventType.map((i) => i.type);

    const participants = await this._getParticipantsToEventByEventId(event.id);

    return {
      ...event.dataValues,
      type: typesArr,
      participants,
    };
  }

  static async deleteSavedEvent(body) {
    const result = await sequelize.models.user_save_event.destroy({
      where: { userId: body.userId, eventId: body.eventId },
    });

    return result;
  }

  static async _getParticipantsToEventByEventId(eventId) {
    const userParticipateEvent =
      await sequelize.models.user_participate_event.count({
        where: {
          eventId,
        },
      });

    return userParticipateEvent + 1;
  }

  static async __getEventTypesByEventId(eventId) {
    const result = await EventType.findAll({
      where: { eventId },
    });

    return result;
  }
}

export default EventUserService;
