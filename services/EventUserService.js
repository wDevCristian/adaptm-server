import Event from "../models/schemas/Event.js";
import User from "../models/schemas/User.js";
import EventType from "../models/schemas/EventType.js";
import { Op } from "sequelize";
import sequelize from "../db.js";
import UserService from "./UserService.js";
import EventService from "./EventService.js";

class EventUserService {
  static async createSavedEvent(userId, eventId) {
    await sequelize.models.user_save_event.create({
      userId,
      eventId,
    });
  }

  static async createAttendee(userId, eventId) {
    await sequelize.models.user_participate_event.create({
      userId,
      eventId,
    });
  }

  static async getAllAttendees(userId) {
    const events = await sequelize.models.user_participate_event.findAll({
      where: {
        userId,
      },
    });

    let resArr = [];

    for (let i = 0; i < events.length; i++) {
      const event = await EventService.getById(events[i].eventId);
      const participants = await this.getParticipantsToEventByEventId(
        events[i].eventId
      );
      const userData = await UserService.getOrganizerFullnameById(
        event.organizerId
      );

      resArr.push({
        ...event.dataValues,
        participants,
        user: userData,
      });
    }

    return resArr;
  }

  static async getSavedEventsByUserId(userId) {
    const resultEvents = await this._getEventsSavedByUserDbObject(userId);
    const savedEvents = resultEvents[0].events;
    let result = [];

    for (let i = 0; i < savedEvents.length; i++) {
      let val = await this.getParticipantsToEventByEventId(savedEvents[i].id);
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

    let resArr = [];

    for (let i = 0; i < events.length; i++) {
      const participants =
        await EventUserService.getParticipantsToEventByEventId(events[i].id);
      resArr.push({ ...events[i].dataValues, participants });
    }

    return resArr;
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

    const participants = await this.getParticipantsToEventByEventId(event.id);

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
  static async deleteAttendee(body) {
    const result = await sequelize.models.user_participate_event.destroy({
      where: { userId: body.userId, eventId: body.eventId },
    });

    return result;
  }

  static async getParticipantsToEventByEventId(eventId) {
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
