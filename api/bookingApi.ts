"use server";

import Booking, { IBooking } from "@/database/booking.model";
import connectDB from "@/lib/mongodb";
import { CreateBookingInput } from "./interface/Booking";

// Helper to convert Mongoose doc to plain object for Client Components
function toPlainObject(doc: IBooking) {
  const plain = doc.toObject({ virtuals: true });
  return {
    ...plain,
    _id: plain._id.toString(),
    createdAt: plain.createdAt?.toISOString(),
    updatedAt: plain.updatedAt?.toISOString(),
  };
}

// Fetch bookings by email
export const getBookingByEmail = async (
  email: string
): Promise<ReturnType<typeof toPlainObject>[] | null> => {
  try {
    await connectDB();

    const bookings = await Booking.find({ email }).sort({ date: 1, time: 1 });

    // Convert each booking to plain object
    return bookings.map(toPlainObject);
  } catch (err) {
    console.error("Error fetching bookings by email:", err);
    return null;
  }
};

// Create booking function
export async function createBooking(data: CreateBookingInput): Promise<any> {
  try {
    await connectDB();

    // Check if this email already has a "single" booking
    if (data.package === "single") {
      const existing = await Booking.findOne({
        email: data.email,
        package: "single",
      });
      if (existing) {
        throw new Error(
          "Vous avez déjà une réservation avec le package 'Gratuite'."
        );
      }
    }

    const booking = await Booking.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      message: data.message,
      package: data.package,
      status: "PENDING",
    });

    return toPlainObject(booking);
  } catch (err: any) {
    // Unique constraint on email+date+time
    if (err.code === 11000) {
      throw new Error(
        "Un créneau est déjà réservé pour cet email, date et heure."
      );
    }
    throw err;
  }
}

