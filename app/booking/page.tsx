"use client";

import { useState } from "react";
import Calendar from "@/components/booking/calendar";
import TimeSlots from "@/components/booking/time-slots";
import BookingInfo from "@/components/booking/booking-info";
import BookingModal from "@/components/booking/booking-modal";
import { useBookings } from "@/hooks/use-bookings";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useTimeSlots } from "@/hooks/use-timeslots";

export default function BookingPage() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const {
    selectedTimeSlots,
    maxSessions,
    currentYear,
    currentMonth,
    selectedDate,
    goToPreviousMonth,
    goToNextMonth,
    toggleTimeSlot,
    selectedPackage,
    showConfirmation,
    loading,
    error,
    isTimeSlotSelected,
    clearTimeSlots,
    setSelectedPackage,
    setSelectedDate,
    setMaxSessions,
    isDayFullyBooked,
    setError,
    isDateBooked,
    handleBooking,
  } = useBookings(userEmail);
  const {
    availableTimes,
    loading: timeSlotsLoading,
    error: timeSlotsError,
  } = useTimeSlots(selectedDate);

  const handleReserverClick = () => {
    if (selectedTimeSlots.length === 0) {
      setError("Veuillez sélectionner au moins un créneau horaire");
      return;
    }

    setShowModal(true);
  };

  const handleModalSubmit = async (data: {
    name: string;
    email: string;
    phone?: string;
  }) => {
    setUserEmail(data.email);
    const success = await handleBooking(data);
    if (success) {
      setShowModal(false);
    }
    return success;
  };
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setError(null);
  };

  const handleTimeToggle = (date: string, time: string) => {
    toggleTimeSlot(selectedDate!, time);
    setError(null);
  };

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-6">Réserver une Séance</h2>

      {error && !showModal && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            ✕
          </button>
        </div>
      )}

      {timeSlotsError && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2 text-yellow-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{timeSlotsError}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <Calendar
              isDayFullyBooked={isDayFullyBooked}
              selectedDate={selectedDate}
              goToNextMonth={goToNextMonth}
              currentMonth={currentMonth}
              currentYear={currentYear}
              goToPreviousMonth={goToPreviousMonth}
              onSelectDate={handleDateSelect}
            />

            {timeSlotsLoading ? (
              <div className="mt-6 flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600">
                  Chargement des créneaux...
                </span>
              </div>
            ) : availableTimes.length === 0 && selectedDate ? (
              <div className="mt-6 text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  Aucun créneau disponible pour ce jour.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Veuillez sélectionner un autre jour.
                </p>
              </div>
            ) : (
              <TimeSlots
                timeSlots={availableTimes}
                selectedDate={selectedDate}
                selectedTimeSlots={selectedTimeSlots}
                onToggleTime={handleTimeToggle}
                isDateBooked={isDateBooked}
              />
            )}

            {selectedTimeSlots.length > 0 && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Créneaux sélectionnés ({selectedTimeSlots.length}/
                  {maxSessions})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTimeSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-sm"
                    >
                      <span className="text-gray-700">
                        {slot.date} - {slot.time}
                      </span>
                      <button
                        onClick={() => handleTimeToggle(slot.date, slot.time)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleReserverClick}
                disabled={selectedTimeSlots.length === 0 || loading}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  selectedTimeSlots.length > 0 && !loading
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Chargement..." : "Réserver"}
              </button>
              {showConfirmation && (
                <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>Réservé ! Vérifiez votre email.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <BookingInfo />
      </div>

      <BookingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        selectedDate={selectedDate}
        selectedTimeSlots={selectedTimeSlots}
        selectedPackage={selectedPackage}
        onPackageSelect={(id) => setSelectedPackage(id)}
        loading={loading}
        error={error}
      />
    </div>
  );
}
