import { TimeSlot } from "@/hooks/use-bookings";
import { Clock } from "lucide-react";

interface TimeSlotsProps {
  timeSlots: string[];
  selectedDate: string | null;
  selectedTimeSlots: TimeSlot[];
  onToggleTime: (date: string, time: string) => void;
  isDateBooked: (date: string, time: string) => boolean;
}

export default function TimeSlots({
  timeSlots,
  selectedDate,
  selectedTimeSlots,
  onToggleTime,
  isDateBooked,
}: TimeSlotsProps) {
  const getDateFromSelectedSlots = () => {
    if (selectedTimeSlots.length === 0) return null;
    return selectedTimeSlots[0].date;
  };

  const currentDate: any = getDateFromSelectedSlots();

  const isTimeSelected = (date: string, time: string): boolean => {
    return selectedTimeSlots.some(
      (slot) => slot.date === date && slot.time === time
    );
  };
  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2 text-black">Choisir une heure</h4>
      <div className="flex flex-wrap gap-3 text-black">
        {timeSlots.map((time) => {
          const disabled = isDateBooked(selectedDate!, time);
          const selected = isTimeSelected(selectedDate!, time);
          return (
            <button
              key={time}
              disabled={disabled}
              onClick={() => onToggleTime(currentDate, time)}
              className={`px-3 py-2 rounded-lg border transition ${
                selected
                  ? "bg-purple-600 text-white border-transparent"
                  : "hover:bg-gray-100"
              } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{time}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
