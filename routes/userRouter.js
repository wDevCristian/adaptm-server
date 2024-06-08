import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = new Router();

router.get("/auth", UserController.check);
router.post("/register", UserController.register);
router.post("/login", UserController.login);

export { router };
