import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  picture?: string;
  googleId: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    googleId: { type: String, required: true, unique: true },
    picture: { type: String },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
