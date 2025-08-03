import { Request, Response } from "express";
import Course from "../models/Course";
import { Types } from "mongoose";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, price, category } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const course = await Course.create({
      title,
      description,
      price,
      instructor: req.user._id as Types.ObjectId,  // ✅ No string conversion
      category,
    });

    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// Get all courses
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.status(200).json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
