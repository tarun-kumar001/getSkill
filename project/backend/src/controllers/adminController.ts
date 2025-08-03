import { Request, Response } from "express";
import User from "../models/User";

// Admin manually assigns instructor role
export const makeInstructor = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    // ✅ Only admin can perform this action
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Only admin can assign instructor role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "instructor" },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Instructor role assigned", user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
