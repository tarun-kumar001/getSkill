import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

// Import routes (later you will add them)
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";

dotenv.config();

const app: Application = express();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// ✅ Default Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to EdTech API" });
});

// ✅ Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

export default app;
