import Event from "../models/schemas/Event.js";
import EventType from "../models/schemas/EventType.js";
import FileService from "./FileService.js";

const TYPE = "events";

class EventService {
  static async create(dataObject) {
    // organizerID is mocked on clientSide, TODO: should be replaced after the login and authorization implementation

    console.log(dataObject);

    const { type, ...eventObject } = dataObject;
    let pictureName;

    if (eventObject.picture) {
      pictureName = FileService.savePicture(eventObject.picture, TYPE);
      eventObject.picture = pictureName;
    }

    const eventRes = await this.__createEvent(eventObject);

    console.log(eventRes);

    const { id } = eventRes;

    const eventTypeResults = [];
    for (let val of type) {
      const eventTypeObject = { type: val, eventId: id };
      const eventTypeRes = await this.__createEventType(eventTypeObject);
      eventTypeResults.push(eventTypeRes);
    }

    return { eventRes, eventTypeResults };
  }

  static async __createEventType(eventType) {
    const result = await EventType.create(eventType);
    return result;
  }

  static async __createEvent(event) {
    const result = await Event.create(event);
    return result;
  }

  static async getAll(params) {
    const result = await Event.findAll(params);
    return result;
  }

  static async count() {
    const result = await Event.count();
    return result;
  }
}

export default EventService;
