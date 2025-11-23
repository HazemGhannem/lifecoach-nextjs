"use client";

import { useState, useEffect } from "react";

export interface Booking {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  status?: string;
  notes?: string;
}

export const useBookings = (userEmail?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  // Fetch bookings on mount and when userEmail changes
  useEffect(() => {
    if (userEmail) {
      fetchBookings();
    }
  }, [userEmail]);

  // Fetch all booked slots for a specific date
  const fetchBookedSlotsForDate = async (date: string) => {
    try {
      const response = await fetch(`/api/bookings?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        const slots:any = new Set(
          data.bookings
            .filter(
              (b: any) => b.status === "PENDING" || b.status === "CONFIRMED"
            )
            .map((b: any) => `${b.date}-${b.time}`)
        );
        setBookedSlots(slots);
      }
    } catch (err) {
      console.error("Error fetching booked slots:", err);
    }
  };

  // Update booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlotsForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchBookings = async () => {
    if (!userEmail) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/bookings?email=${userEmail}`);

      if (response.ok) {
        const data = await response.json();
        setBookings(
          data.bookings.filter(
            (b: any) => b.status === "PENDING" || b.status === "CONFIRMED"
          )
        );
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (err) {
      setError("An error occurred while fetching bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isDateBooked = (isoDate: string, time: string): boolean => {
    return bookedSlots.has(`${isoDate}-${time}`);
  };

  const handleBooking = async (bookingData: {
    name: string;
    email: string;
    phone?: string;
  }) => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return false;
    }

    if (isDateBooked(selectedDate, selectedTime)) {
      setError("Ce créneau est déjà réservé");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingData,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create booking");
        return false;
      }

      // Add to local bookings
      setBookings((prev) => [...prev, data.booking]);

      // Update booked slots
      setBookedSlots((prev) =>
        new Set(prev).add(`${selectedDate}-${selectedTime}`)
      );

      setShowConfirmation(true);

      setTimeout(() => {
        setShowConfirmation(false);
        setSelectedDate(null);
        setSelectedTime(null);
      }, 3000);

      return true;
    } catch (err) {
      setError("An error occurred while creating the booking");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!bookingId) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError("Failed to cancel booking");
        return false;
      }

      // Remove from local bookings
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));

      // Refresh booked slots if date is selected
      if (selectedDate) {
        fetchBookedSlotsForDate(selectedDate);
      }

      return true;
    } catch (err) {
      setError("An error occurred while cancelling the booking");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    selectedDate,
    selectedTime,
    showConfirmation,
    loading,
    error,
    setSelectedDate,
    setSelectedTime,
    setError,
    isDateBooked,
    handleBooking,
    cancelBooking,
    fetchBookings,
  };
};
