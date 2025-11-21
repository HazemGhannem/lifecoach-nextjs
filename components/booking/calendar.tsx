import { CalendarIcon } from "lucide-react";
import { CalendarData } from "@/types";
import { formatISO, buildCalendarWeeks } from "@/lib/utils";

interface CalendarProps {
  calendarData: CalendarData;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function Calendar({
  calendarData,
  selectedDate,
  onSelectDate,
}: CalendarProps) {
  const { year, month, firstDay, daysInMonth } = calendarData;
  const weeks = buildCalendarWeeks(firstDay, daysInMonth);

  return (
    <>
      <div className="flex items-center mb-4">
        <CalendarIcon className="h-6 w-6 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold">Sélectionner une Date</h3>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {DAYS.map((day) => (
          <div key={day} className="font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}

        {weeks.flat().map((day, idx) => {
          if (day === null) return <div key={idx} className="py-3" />;
          const iso = formatISO(year, month, day);
          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={`py-3 rounded-md transition ${
                selectedDate === iso
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-50"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </>
  );
}
