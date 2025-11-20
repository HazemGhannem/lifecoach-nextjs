import ContactForm from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <div className="pt-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <p className="text-sm text-gray-600 mb-6">
          Send a message and I'll get back to you within 48 hours.
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
