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

  static async update(req, res, next) {
    try {
      const id = req.body.id;
      if (!id) {
        return next(ApiError.badRequest("Not provided ID"));
      }

      let picture = req?.files?.picture || null;
      let textDate = req.body;
      let updatedObject;

      if (picture === null) {
        updatedObject = await EventService.updateById(id, { ...textDate });
      } else {
        updatedObject = await EventService.updateById(id, {
          picture,
          ...textDate,
        });
      }

      res.json(updatedObject);
    } catch (error) {
      console.log(error);
      return next(ApiError.internalServerError(error.message));
    }
  }
}

export default EventController;

// let sampleObj = {
//   picture: {
//     name: "ac_logo.png",
//     data: "<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 01 f3 00 00 00 77 08 06 00 00 00>",
//     size: 14335,
//     encoding: "7bit",
//     tempFilePath: "",
//     truncated: false,
//     mimetype: "image/png",
//     md5: "7c767d27a6e379f47da2427fda32c51e",
//     mv: "[Function: mv]",
//   },
//   title: "Titlu eveniment",
//   type: ["culture", "entertainment", "music", "sport"],
//   startDateTime: "2024-06-11T12:00:00.000Z",
//   endDateTime: "2024-06-11T15:00:00.000Z",
//   maxNrOfParticipants: "203",
//   description: "This is the description of an event.",
//   latitude: "45.7437200475276",
//   longitude: "21.250174556768364",
//   street: "Strada Profesor Doctor Aurel Păunescu Podeanu",
//   city: "Timișoara",
//   building: "Sala Polivalentă a Politehnicii",
//   organizerId: "1",
// };
