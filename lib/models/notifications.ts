import mongoose, { Schema, Document, models } from "mongoose";

interface INotification extends Document {
  content: string;
  userId: string;
  isRead: boolean;
  type: "absence" | "event" | "task" | "message";
  urgency: "low" | "medium" | "high";
}

const notificationSchema = new Schema<INotification>(
  {
    content: { type: String, required: true },
    userId: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["absence", "event", "task", "message"],
      required: true,
    },
    urgency: { type: String, enum: ["low", "medium", "high"], required: true },
  },
  { timestamps: true }
);

const NotificationModel =
  models.notification ||
  mongoose.model<INotification>("notification", notificationSchema);

export default NotificationModel;
