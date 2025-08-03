import { Router } from "express";
import { googleAuth } from "../controllers/authController";

const router = Router();

// POST: Google Login/Register
router.post("/google", googleAuth);

export default router;
