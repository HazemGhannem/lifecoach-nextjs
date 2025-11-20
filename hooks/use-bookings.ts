"use client";

import { useState } from "react";
import { Booking } from "@/types";

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isDateBooked = (isoDate: string, time: string): boolean =>
    bookings.some((b) => b.date === isoDate && b.time === time);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    if (isDateBooked(selectedDate, selectedTime)) return;

    setBookings((prev) => [
      ...prev,
      { date: selectedDate, time: selectedTime },
    ]);
    setShowConfirmation(true);

    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedDate(null);
      setSelectedTime(null);
    }, 2500);
  };

  const cancelBooking = (index: number) => {
    setBookings((prev) => prev.filter((_, idx) => idx !== index));
  };

  return {
    bookings,
    selectedDate,
    selectedTime,
    showConfirmation,
    setSelectedDate,
    setSelectedTime,
    isDateBooked,
    handleBooking,
    cancelBooking,
  };
};
