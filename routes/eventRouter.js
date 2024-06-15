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
router.post("/saved", EventController.createSavedEvent);
router.put("/update", authMiddleware, EventController.update);
router.post("/create", authMiddleware, EventController.create);
router.delete("/saved", authMiddleware, EventController.deleteSavedEvent);
router.delete("/delete/:id", EventController.deleteById); // TODO: eliminate this functionality

export { router };
