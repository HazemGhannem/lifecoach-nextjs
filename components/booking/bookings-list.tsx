import { CalendarIcon } from "lucide-react";
import { Booking } from "@/types";

interface BookingsListProps {
  bookings: Booking[];
  onCancel: (index: number) => void;
}

export default function BookingsList({
  bookings,
  onCancel,
}: BookingsListProps) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow p-6">
      <h4 className="font-semibold mb-4">Upcoming Bookings</h4>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking, i) => (
            <li
              key={`${booking.date}-${booking.time}-${i}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium">{booking.date}</div>
                  <div className="text-sm text-gray-500">{booking.time}</div>
                </div>
              </div>
              <button
                onClick={() => onCancel(i)}
                className="text-sm text-red-500 hover:text-red-700 transition"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
