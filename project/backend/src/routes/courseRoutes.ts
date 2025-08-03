import { Router } from "express";
import { createCourse, getAllCourses, getCourseById } from "../controllers/courseController";
import { protect, isInstructor } from "../middlewares/authMiddleware";

const router = Router();

// POST: Create a new course (Only instructor)
router.post("/", protect, isInstructor, createCourse);

// GET: Fetch all courses
router.get("/", getAllCourses);

// GET: Fetch single course by ID
router.get("/:id", getCourseById);

export default router;
