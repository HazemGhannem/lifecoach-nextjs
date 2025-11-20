"use client";

import { useState, FormEvent } from "react";
import { CheckCircle } from "lucide-react";
import { ContactFormData } from "@/types";

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormSubmitted(true);
    // In a real app, POST to backend here

    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          rows={5}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={!isFormValid}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            isFormValid
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Send Message
        </button>

        {formSubmitted && (
          <div className="inline-flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Message sent!</span>
          </div>
        )}
      </div>

      <div className="pt-4 text-sm text-gray-500">
        Or email directly:{" "}
        <a
          href="mailto:sarah@example.com"
          className="text-purple-600 hover:text-purple-700"
        >
          sarah@example.com
        </a>
      </div>
    </form>
  );
}
