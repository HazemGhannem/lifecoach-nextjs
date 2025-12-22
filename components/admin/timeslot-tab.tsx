"use client";

import { useState, useEffect } from "react";
import {
  getAllTimeSlots,
  createTimeSlot,
  deleteTimeSlot,
  updateTimeSlot,
} from "@/lib/actions/timeslot.action";
import { Plus, Trash2, Edit2, Calendar, Clock } from "lucide-react";
import { Toast } from "../Toast";
import ConfirmModal from "./ConfirmModal";

// Predefined time slots to choose from
const PRESET_TIME_SLOTS = [
  { startTime: "09:00", endTime: "09:40" },
  { startTime: "10:00", endTime: "10:40" },
  { startTime: "10:30", endTime: "11:10" },
  { startTime: "11:00", endTime: "11:40" },
  { startTime: "12:00", endTime: "12:40" },
  { startTime: "14:00", endTime: "14:40" },
  { startTime: "15:00", endTime: "15:40" },
  { startTime: "15:30", endTime: "16:10" },
  { startTime: "16:00", endTime: "16:40" },
  { startTime: "17:00", endTime: "17:40" },
];

export default function TimeSlotsAdmin() {
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // For bulk adding
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [addingBulk, setAddingBulk] = useState(false);

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    setLoading(true);
    const result = await getAllTimeSlots();
    if (result.success && result.timeSlots) {
      setTimeSlots(result.timeSlots);
    }
    setLoading(false);
  };

  // Toggle a time slot selection
  const toggleTimeSlotSelection = (startTime: string) => {
    if (selectedTimeSlots.includes(startTime)) {
      setSelectedTimeSlots(selectedTimeSlots.filter((t) => t !== startTime));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, startTime]);
    }
  };

  // Add all selected time slots for the selected date
  const handleBulkAdd = async () => {
    if (!selectedDate) {
      setToast({
        message: "Veuillez choisir une date",
        type: "error",
      });
      return;
    }

    if (selectedTimeSlots.length === 0) {
      setToast({
        message: "Veuillez sélectionner au moins un créneau horaire",
        type: "error",
      });

      return;
    }

    setAddingBulk(true);

    let successCount = 0;
    let errorCount = 0;

    for (const startTime of selectedTimeSlots) {
      const slot = PRESET_TIME_SLOTS.find((s) => s.startTime === startTime);
      if (slot) {
        const result = await createTimeSlot({
          date: selectedDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: true,
          maxBookings: 1,
        });

        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      }
    }

    setAddingBulk(false);

    if (successCount > 0) {
      setToast({
        message: `${successCount} créneau(x) ajouté(s) avec succès!${
          errorCount > 0 ? ` (${errorCount} erreur(s))` : ""
        }`,
        type: "success",
      });

      setSelectedDate("");
      setSelectedTimeSlots([]);
      fetchTimeSlots();
    }
  };

  // Single time slot add
  const [singleSlotForm, setSingleSlotForm] = useState({
    date: "",
    startTime: "09:00",
    endTime: "09:40",
  });

  const handleSingleAdd = async () => {
    if (!singleSlotForm.date) {
      setToast({
        message: "Veuillez choisir une date",
        type: "error",
      });

      return;
    }

    const result = await createTimeSlot({
      ...singleSlotForm,
      isAvailable: true,
      maxBookings: 1,
    });

    if (result.success) {
      setToast({
        message: "Créneau ajouté avec succès!",
        type: "success",
      });

      setSingleSlotForm({ date: "", startTime: "09:00", endTime: "09:40" });
      setShowAddForm(false);
      fetchTimeSlots();
    } else {
      setToast({
        message: "" + result.error,
        type: "error",
      });
    }
  };
  const handleDeleteTimeSlot = (id: string) => {
    setDeleteId(id); // opens the confirmation modal
  };
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const success: any = await deleteTimeSlot(deleteId);
      if (success) {
        await fetchTimeSlots();
        setToast({
          message: "caneaux supprimé avec succès !",
          type: "success",
        });
      } else {
        setToast({
          message: "Échec de la suppression du caneaux.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Delete package error:", error);
      setToast({
        message: "Erreur lors de la suppression du caneau.",
        type: "error",
      });
    } finally {
      setDeleteId(null); // close the confirmation modal
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    const result = await updateTimeSlot(id, data);
    if (result.success) {
      setEditingId(null);
      fetchTimeSlots();
    }
  };

  // Group slots by date
  const slotsByDate = timeSlots.reduce((acc: any, slot: any) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="pt-6 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold ">Gestion des Créneaux Horaires</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Ajouter un Créneau Unique
        </button>
      </div>

      {/* ============ BULK ADD SECTION ============ */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 mb-8 border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Ajouter Plusieurs Créneaux pour une Date
          </h2>
        </div>

        <div className="space-y-4">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              1. Sélectionnez la date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full md:w-1/2 border-2 border-purple-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 appearance-none"
            />
          </div>

          {/* Time Slots Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              2. Sélectionnez les créneaux horaires{" "}
              <span className="text-gray-500 font-normal">
                (Cliquez pour sélectionner/désélectionner)
              </span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {PRESET_TIME_SLOTS.map((slot) => {
                const isSelected = selectedTimeSlots.includes(slot.startTime);
                return (
                  <button
                    key={slot.startTime}
                    onClick={() => toggleTimeSlotSelection(slot.startTime)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "bg-purple-600 border-purple-600 text-white shadow-lg transform scale-105"
                        : "bg-white border-gray-300 text-gray-700 hover:border-purple-400"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        {slot.startTime}
                      </span>
                    </div>
                    <div className="text-xs mt-1 opacity-75">
                      {slot.endTime}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary and Add Button */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-200">
            <div className="text-sm text-gray-600">
              {selectedDate && (
                <span className="font-medium">
                  Date: {new Date(selectedDate).toLocaleDateString("fr-FR")}
                </span>
              )}
              {selectedTimeSlots.length > 0 && (
                <span className="ml-4 font-medium text-purple-600">
                  {selectedTimeSlots.length} créneau(x) sélectionné(s)
                </span>
              )}
            </div>

            <button
              onClick={handleBulkAdd}
              disabled={
                !selectedDate || selectedTimeSlots.length === 0 || addingBulk
              }
              className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                selectedDate && selectedTimeSlots.length > 0 && !addingBulk
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {addingBulk ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Ajouter les Créneaux
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============ SINGLE ADD FORM ============ */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            Ajouter un Créneau Unique
          </h3>

          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={singleSlotForm.date}
                onChange={(e) =>
                  setSingleSlotForm({ ...singleSlotForm, date: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Début</label>
              <input
                type="time"
                value={singleSlotForm.startTime}
                onChange={(e) =>
                  setSingleSlotForm({
                    ...singleSlotForm,
                    startTime: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fin</label>
              <input
                type="time"
                value={singleSlotForm.endTime}
                onChange={(e) =>
                  setSingleSlotForm({
                    ...singleSlotForm,
                    endTime: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSingleAdd}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Ajouter
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* ============ EXISTING TIME SLOTS ============ */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Créneaux Existants
        </h2>

        {Object.keys(slotsByDate).length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Aucun créneau configuré pour le moment
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Utilisez le formulaire ci-dessus pour ajouter des créneaux
            </p>
          </div>
        )}

        {Object.keys(slotsByDate)
          .sort()
          .reverse()
          .map((date) => (
            <div key={date} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {new Date(date + "T00:00:00").toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {slotsByDate[date]
                  .sort((a: any, b: any) =>
                    a.startTime.localeCompare(b.startTime)
                  )
                  .map((slot: any) => (
                    <div
                      key={slot._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      {editingId === slot._id ? (
                        /* EDIT MODE */
                        <div className="w-full space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="time"
                              defaultValue={slot.startTime}
                              onChange={(e) =>
                                (slot.startTime = e.target.value)
                              }
                              className="border rounded p-1 text-sm"
                            />
                            <input
                              type="time"
                              defaultValue={slot.endTime}
                              onChange={(e) => (slot.endTime = e.target.value)}
                              className="border rounded p-1 text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleUpdate(slot._id, {
                                  startTime: slot.startTime,
                                  endTime: slot.endTime,
                                })
                              }
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded"
                            >
                              Sauvegarder
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 bg-gray-300 text-xs rounded"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* VIEW MODE */
                        <>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-sm text-gray-800">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                slot.isAvailable
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {slot.isAvailable ? "✓" : "✗"}
                            </span>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingId(slot._id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTimeSlot(slot._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
      <ConfirmModal
        isOpen={!!deleteId}
        message="Voulez-vous vraiment supprimer ce créneau ?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
