import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

interface DecodedToken {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

      const user = await User.findById(decoded.id).select("-password") as IUser | null;

      if (!user) return res.status(404).json({ message: "User not found" });

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  res.status(401).json({ message: "Not authorized, no token" });
};

export const isInstructor = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role === "instructor") {
      return next();
    }
    return res.status(403).json({ message: "Access denied. Instructor only." });
  };