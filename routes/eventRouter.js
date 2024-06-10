import { Router } from "express";
import EventController from "../controllers/EventController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();

router.get("/all", EventController.getAll);
router.get("/:id", EventController.getById);
router.put("/update", authMiddleware, EventController.update);
router.post("/create", authMiddleware, EventController.create);
router.post("/delete/:id", EventController.deleteById); // TODO: eliminate this functionality

export { router };
