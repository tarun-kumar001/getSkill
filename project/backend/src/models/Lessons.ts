import mongoose, { Document, Schema } from "mongoose";

export interface ILesson extends Document {
  title: string;
  content: string;
  videoUrl?: string;
  course: mongoose.Types.ObjectId;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    videoUrl: { type: String },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILesson>("Lesson", lessonSchema);
