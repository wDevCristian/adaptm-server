import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = new Router();

router.get("/auth", UserController.check);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/update", UserController.update);
router.get("/:id", UserController.getById);

export { router };
