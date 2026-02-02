export default function MerciPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Merci pour votre réservation !
          </h1>
          <p className="text-gray-600">
            Votre séance gratuite a été confirmée avec succès.
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-purple-900">
            📧 Vous recevrez un email de confirmation sous peu avec tous les
            détails de votre réservation.
          </p>
        </div>

        <a
          href="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
