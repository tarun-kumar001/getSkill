import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  price: number;
  instructor: Types.ObjectId;   // ✅ Use ObjectId type
  lessons: Types.ObjectId[];
  category: string;
  thumbnail?: string;
  published: boolean;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
    category: {
      type: String,
      enum: ["programming", "design", "business", "other"],
      default: "other",
    },
    thumbnail: { type: String, default: "default-course.jpg" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>("Course", courseSchema);
