import { Router } from "express";
import { router as eventRouter } from "./eventRouter.js";
import { router as userRouter } from "./userRouter.js";

const router = new Router();

router.use("/user", userRouter);
router.use("/event", eventRouter);

export default router;
