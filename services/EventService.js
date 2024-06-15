import Event from "../models/schemas/Event.js";
import EventType from "../models/schemas/EventType.js";
import FileService from "./FileService.js";
import { Op } from "sequelize";
import EventUserService from "./EventUserService.js";

const TYPE = "events";

class EventService {
  static async create(dataObject) {
    // organizerID is mocked on clientSide, TODO: should be replaced after the login and authorization implementation

    console.log(dataObject);

    let { type, ...eventObject } = dataObject;

    type = Array.isArray(type) ? type : [type];

    let pictureName;

    if (eventObject.picture) {
      pictureName = FileService.savePicture(eventObject.picture, TYPE);
      eventObject.picture = pictureName;
    }

    const eventRes = await Event.create(eventObject);

    console.log(eventRes);

    const { id } = eventRes;

    const eventTypeResults = await this.__createEventTypes(type, id);

    return { eventRes, eventTypeResults };
  }

  static async count() {
    const result = await Event.count();
    return result;
  }

  static async getById(id) {
    const result = await Event.findByPk(id);

    return result;
  }

  static async getAll(params) {
    const result = await Event.findAll(params);
    return result;
  }

  static async getAllByOrganizerId(organizerId) {
    const result = await Event.findAll({
      where: {
        organizerId,
        startDateTime: {
          [Op.gte]: new Date(),
        },
      },
      order: [["startDateTime", "ASC"]],
    });

    console.log(result);

    return result;
  }

  /**
   * Updates an existing event in the database.
   *
   * @param {number} id - The id of the event to update.
   * @param {object} dataObject - The updated event data.
   * @param {string} dataObject.title - The updated title of the event.
   * @param {string} dataObject.description - The updated description of the event.
   * @param {Date} dataObject.startDateTime - The updated start date and time of the event.
   * @param {Date} dataObject.endDateTime - The updated end date and time of the event.
   * @param {string} dataObject.picture - The updated picture of the event.
   * @param {Array.<string>} dataObject.type - The updated types of the event.
   * @param {number} dataObject.maxNrOfParticipants - The updated maximum number of participants of the event.
   * @param {number} dataObject.latitude - The updated latitude of the event.
   * @param {number} dataObject.longitude - The updated longitude of the event.
   * @param {string} dataObject.street - The updated street of the event.
   * @param {string} dataObject.city - The updated city of the event.
   * @param {string} dataObject.building - The updated building of the event.
   * @param {string} dataObject.addressNr - The updated address number of the event.
   *
   * @returns {object} - An object containing the updated event and the response from updating event types.
   * @returns {object} result - The updated event.
   * @returns {object} eventTypesResponse - The response from updating event types.
   */
  static async updateById(id, dataObject) {
    const event = await Event.findByPk(id);
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      picture = null,
      type,
      maxNrOfParticipants,
      latitude,
      longitude,
      street,
      city,
      building = null,
      addressNr = null,
    } = dataObject;

    // update fields, except picture and type fields
    event.title = title;
    event.description = description;
    event.startDateTime = startDateTime;
    event.endDateTime = endDateTime;
    event.maxNrOfParticipants = maxNrOfParticipants;

    if (event.latitude !== latitude || event.longitude !== longitude) {
      event.latitude = latitude;
      event.longitude = longitude;
      event.street = street;
      event.city = city;
      event.building = building;
      event.addressNr = addressNr;
    }

    // update picture logic
    // If existing picture and uploaded a new one => delete the old picture and upload the new
    if (event.picture && picture) {
      FileService.deletePicture(event.picture, TYPE);
      pictureName = FileService.savePicture(picture, TYPE);
      event.picture = pictureName;
    }

    // if existing picture and deleted the existed one => delete the picture
    if (event.picture && !picture) {
      FileService.deletePicture(event.picture, TYPE);
      event.picture = picture;
    }

    // if not existing picture and uploaded a new one => upload the new
    if (!event.picture && picture) {
      pictureName = FileService.savePicture(picture, TYPE);
      event.picture = pictureName;
    }

    // if not existing picture and not uploaded a new one => do nothing
    if (!event.picture && !picture) {
      // do nothing
    }

    const eventTypesResponse = await this.__updateEventTypesOfEventById(
      type,
      event.id
    );
    const result = await event.save();
    return { result, eventTypesResponse };
  }

  /**
   * Updates the event types of an event in the database.
   *
   * @param {Array.<string>} types - The updated types of the event.
   * @param {number} eventId - The id of the event.
   *
   * @returns {object} - The response from updating event types.
   * @returns {object[]} eventTypesResponse - An array of objects, each representing the result of updating an event type.
   *
   * @private
   */
  static async __updateEventTypesOfEventById(types, eventId) {
    const rows = await this.__getEventTypesByEventId(eventId);
    let eventType = [];

    // Extract the types from the rows
    rows.forEach((row) => {
      eventType.push(row.type);
    });

    // Compare the new types with the existing types and remove the matching ones
    for (let i = 0; i < types.length; i++) {
      const ne = types[i];
      for (let j = 0; j < eventType.length; j++) {
        const oe = eventType[j];
        if (ne === oe) {
          eventType.splice(eventType.indexOf(oe), 1);
          types.splice(types.indexOf(ne), 1);
          i--;
          break;
        }
      }
    }

    let eventTypesResponse;

    // If there are any existing types to delete, delete them
    if (eventType.length > 0) {
      eventTypesResponse = await this.__deleteEventTypes(eventType, eventId);
    }

    // If there are any new types to create, create them
    if (types.length > 0) {
      eventTypesResponse = await this.__createEventTypes(types, eventId);
    }

    return eventTypesResponse;
  }

  static async __createEventType(eventType) {
    const result = await EventType.create(eventType);
    return result;
  }

  static async __createEventTypes(types, eventId) {
    const eventTypeResults = [];
    for (let type of types) {
      const eventTypeObject = { type, eventId };
      const eventTypeRes = await this.__createEventType(eventTypeObject);
      eventTypeResults.push(eventTypeRes);
    }

    return eventTypeResults;
  }

  static async __deleteEventTypes(types, eventId) {
    const eventTypeResults = [];
    for (let type of types) {
      const eventTypeObject = { type, eventId };
      const eventTypeRes = await this.__deleteEventTypeByTypeAndEventId(
        eventTypeObject,
        eventId
      );
      eventTypeResults.push(eventTypeRes);
    }

    return eventTypeResults;
  }

  static async __deleteEventTypeByTypeAndEventId(eventType, eventId) {
    const result = await EventType.destroy({
      where: { eventId, type: eventType.type },
    });
    return result;
  }

  static async __getEventTypesByEventId(eventId) {
    const result = await EventType.findAll({
      where: { eventId },
    });

    return result;
  }
}

export default EventService;
