import { Mail, Phone } from "lucide-react";

export default function BookingInfo() {
  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-semibold mb-3">Quick Info</h4>
        <p className="text-sm text-gray-600 mb-4">
          Sessions are 60 minutes. Choose a date then a time and press
          "Reserve". You will receive a confirmation here. For payment and final
          confirmation we will contact you by email.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-600" />
            <a
              className="text-sm text-gray-700 hover:text-purple-600"
              href="mailto:sarah@example.com"
            >
              sarah@example.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-purple-600" />
            <a
              className="text-sm text-gray-700 hover:text-purple-600"
              href="tel:+1234567890"
            >
              +1 234 567 890
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h4 className="font-semibold mb-3">How it works</h4>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
          <li>Pick a date</li>
          <li>Choose a time</li>
          <li>Reserve (we'll email you to confirm & process payment)</li>
        </ol>
      </div>
    </div>
  );
}
