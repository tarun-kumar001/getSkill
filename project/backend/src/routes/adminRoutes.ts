import { Router } from "express";
import { makeInstructor } from "../controllers/adminController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/assign-instructor", protect, makeInstructor);

export default router;
