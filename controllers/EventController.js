import ApiError from "../error/apiError.js";
import EventService from "../services/EventService.js";
import EventUserService from "../services/EventUserService.js";

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

  static async createSavedEvent(req, res, next) {
    try {
      const reqBody = req.body || {};

      console.log(reqBody);

      if (!reqBody.userId || !reqBody.eventId) {
        return next(
          ApiError.badRequest({
            isCreated: false,
            message: "Data missing from request body.",
          })
        );
      }

      await EventUserService.createSavedEvent(reqBody.userId, reqBody.eventId);

      res.json({ isCreated: true });
    } catch (error) {
      console.log(error);
      return next(
        ApiError.badRequest({ isCreated: false, message: error.message })
      );
    }
  }

  static async createAttendee(req, res, next) {
    try {
      const reqBody = req.body || {};

      console.log(reqBody);

      if (!reqBody.userId || !reqBody.eventId) {
        return next(
          ApiError.badRequest({
            isCreated: false,
            message: "Data missing from request body.",
          })
        );
      }

      await EventUserService.createAttendee(reqBody.userId, reqBody.eventId);

      res.json({ isCreated: true });
    } catch (error) {
      console.log(error);
      return next(
        ApiError.badRequest({ isCreated: false, message: error.message })
      );
    }
  }

  static async getAllAttendees(req, res, next) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return next(ApiError.badRequest("User ID not provided"));
      }

      const result = await EventUserService.getAllAttendees(userId);
      res.json(result);
    } catch (error) {
      console.log(error);
      return next(ApiError.internalServerError(error));
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return next(ApiError.badRequest("Not provided ID"));
      }

      const result = await EventUserService.getEventDetailsById(id);
      res.json(result);
    } catch (error) {
      console.log(error);
      return next(ApiError.internalServerError(error));
    }
  }

  static async getAll(req, res) {
    try {
      let { limit, page } = req.query;
      limit = limit || 16;
      page = page || 1;
      let offset = (page - 1) * limit;

      const result = await EventUserService.getAll({ limit, offset });

      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async getAllByOrganizerId(req, res) {
    try {
      const organizerId = req.params.organizerId;

      if (!organizerId) {
        return next(ApiError.badRequest("Organizer ID not provided"));
      }

      const result = await EventService.getAllByOrganizerId(organizerId);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error.message);
    }
  }

  static async getSavedEventsByUserId(req, res, next) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return next(ApiError.badRequest("User ID not provided"));
      }

      const result = await EventUserService.getSavedEventsByUserId(userId);
      res.json(result);
    } catch (error) {
      console.log(error);
      return next(ApiError.internalServerError(error));
    }
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

  static async deleteById(req, res) {
    res.json({ message: "Successfully deleted..." });
  }

  static async deleteSavedEvent(req, res, next) {
    try {
      const { userId, eventId } = req.query;

      if (!userId || !eventId) {
        return next(ApiError.badRequest("UserId or eventId not provided"));
      }

      const result = await EventUserService.deleteSavedEvent({
        userId,
        eventId,
      });

      res.json({ isDeleted: Boolean(result) });
    } catch (error) {
      console.log(error);
      return next(
        ApiError.internalServerError({
          isDeleted: false,
          message: error.message,
        })
      );
    }
  }

  static async deleteAttendee(req, res, next) {
    try {
      const { userId, eventId } = req.query;

      if (!userId || !eventId) {
        return next(ApiError.badRequest("UserId or eventId not provided"));
      }

      const result = await EventUserService.deleteAttendee({
        userId,
        eventId,
      });

      res.json({ isDeleted: Boolean(result) });
    } catch (error) {
      console.log(error);
      return next(
        ApiError.internalServerError({
          isDeleted: false,
          message: error.message,
        })
      );
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
