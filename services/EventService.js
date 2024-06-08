import Event from "../models/schemas/Event.js";

class EventService {
  static async create(event) {
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
