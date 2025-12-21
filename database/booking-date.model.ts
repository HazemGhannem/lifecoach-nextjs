import { Schema, model, models, Document } from "mongoose";

export interface IBookingDate extends Document {
  date: string; // Format: YYYY-MM-DD
  times: Schema.Types.ObjectId[]; // References to BookingTime
  createdAt: Date;
  updatedAt: Date;
}

const BookingDateSchema = new Schema<IBookingDate>(
  {
    date: {
      type: String,
      required: [true, "La date est requise"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"],
    },
    times: [
      {
        type: Schema.Types.ObjectId,
        ref: "BookingTime",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const BookingDate =
  models.BookingDate || model<IBookingDate>("BookingDate", BookingDateSchema);

export default BookingDate;
