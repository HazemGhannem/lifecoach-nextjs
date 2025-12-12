import { Schema, model, models, Document } from "mongoose";

export interface IBookingTime extends Document {
  time: string; // Format: HH:MM
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  createdAt: Date;
  updatedAt: Date;
}

const BookingTimeSchema = new Schema<IBookingTime>(
  {
    time: {
      type: String,
      required: [true, "L'heure est requise"],
      match: [/^\d{2}:\d{2}$/, "Format d'heure invalide (HH:MM)"],
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const BookingTime =
  models.BookingTime || model<IBookingTime>("BookingTime", BookingTimeSchema);

export default BookingTime;
