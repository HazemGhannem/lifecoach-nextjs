import { Schema, model, models, Document } from "mongoose";

export interface IBooking extends Document {
  name: string;
  email: string;
  phone?: string;
  date: Schema.Types.ObjectId[];
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  message?: string;
  package?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email invalide"],
    },
    phone: {
      type: String,
      trim: true,
    },
    date: [
      {
        type: Schema.Types.ObjectId,
        ref: "BookingDate",
      },
    ],
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"],
      default: "PENDING",
    },
    message: {
      type: String,
      trim: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for unique booking constraint
BookingSchema.index({ email: 1, date: 1, time: 1 }, { unique: true });

// Create indexes for faster queries
BookingSchema.index({ date: 1, time: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ status: 1 });

// Method to check if booking is in the past
BookingSchema.methods.isPast = function () {
  const bookingDate = new Date(`${this.date}T${this.time}`);
  return bookingDate < new Date();
};

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
