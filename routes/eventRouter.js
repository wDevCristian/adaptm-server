import { Router } from "express";
import EventController from "../controllers/EventController.js";

const router = new Router();

router.get("/all", EventController.getAll);
router.get("/:id", EventController.getById);
router.put("/update", EventController.update);
router.post("/create", EventController.create);
router.post("/delete/:id", EventController.deleteById);

export { router };
