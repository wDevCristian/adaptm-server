import { Router } from "express";
import EventController from "../controllers/EventController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();

router.get("/all", EventController.getAll);
router.get(
  "/all/:organizerId",
  authMiddleware,
  EventController.getAllByOrganizerId
);
router.get("/:id", EventController.getById);
router.get(
  "/saved/:userId",
  authMiddleware,
  EventController.getSavedEventsByUserId
);
router.get(
  "/attendees/:userId",
  authMiddleware,
  EventController.getAllAttendees
);
router.post("/attendees", authMiddleware, EventController.createAttendee);
router.post("/saved", EventController.createSavedEvent);
router.post("/create", authMiddleware, EventController.create);
router.put("/update", authMiddleware, EventController.update);
router.delete("/saved", authMiddleware, EventController.deleteSavedEvent);
router.delete("/attendees", authMiddleware, EventController.deleteAttendee);
router.delete("/delete/:id", EventController.deleteById); // TODO: eliminate this functionality

export { router };
