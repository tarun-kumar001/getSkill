import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  amount: number;
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: "credit_card" | "paypal" | "upi" | "netbanking";
}

const paymentSchema = new Schema<IPayment>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "upi", "netbanking"],
      default: "upi",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);
