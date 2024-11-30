// models/Feedback.ts

import { Schema, model, models } from "mongoose";

const feedbackSchema = new Schema(
  {
    name: { type: String, required: false, default: "Anonymous" },
    message: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

const Feedback = models.Feedback || model("Feedback", feedbackSchema);

export default Feedback;
