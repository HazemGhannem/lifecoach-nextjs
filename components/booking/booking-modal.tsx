"use client";

import { useState, FormEvent } from "react";
import { X, Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { createBooking } from "@/api/bookingApi";
import { CreateBookingInput } from "@/api/interface/Booking";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    phone?: string;
  }) => Promise<void>;
  selectedDate: string | null;
  selectedTime: string | null;
  loading?: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  selectedTime,
  loading = false,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSuccess(false);
    setSubmitting(true);

    const data: CreateBookingInput = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: selectedDate ?? undefined,
      time: selectedTime ?? undefined,
      package: "single",
    };

    try {
      await createBooking(data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (error: any) {
      setErr(
        error?.message ||
          "Un créneau est déjà réservé pour cet email, date et heure."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Confirmer votre réservation
            </h3>
            <p className="text-sm text-gray-600">
              Veuillez remplir vos informations pour finaliser la réservation
            </p>
          </div>

          {/* Selected slot info */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">
                {formatDate(selectedDate)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">{selectedTime}</span>
              <span className="text-sm text-gray-600">(15 minutes)</span>
            </div>
          </div>

          {/* Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 mb-4">
              ✅ Votre réservation a été confirmée !
            </div>
          )}
          {err && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
              ❌ {err}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
              ✨ <strong>Première séance de 15 min gratuite !</strong>
              <br />
              Vous recevrez un email de confirmation avec tous les détails.
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.name || !formData.email}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Réservation..." : "Confirmer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
