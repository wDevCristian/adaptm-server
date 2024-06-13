import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = new Router();

<<<<<<< Updated upstream
router.get("/auth", UserController.check);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/update", UserController.update);
router.get("/:id", UserController.getById);
=======
router.get("/auth", authMiddleware, UserController.check);
router.get("/:id", UserController.getById); // TODO: remove this
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/update", authMiddleware, UserController.update);
>>>>>>> Stashed changes

export { router };
