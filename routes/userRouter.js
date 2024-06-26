import { Router } from "express";
import UserController from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();

router.get("/auth", authMiddleware, UserController.check);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/update", authMiddleware, UserController.update);
router.get("/:id", UserController.getById); // TODO: eliminate this functionality, when server ready

export { router };
