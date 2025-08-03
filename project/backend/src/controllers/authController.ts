import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Missing Google ID token" });
    }

    // ✅ Verify token with Google servers
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ message: "Google verification failed" });
    }

    const { name, email, sub: googleId, picture } = payload;

    // ✅ Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // New users are always "student" by default
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        role: "student",
      });
    }

    const token = generateToken(user._id.toString(), user.role);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
