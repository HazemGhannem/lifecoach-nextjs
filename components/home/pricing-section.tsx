import Link from "next/link";
import { CheckCircle } from "lucide-react";

const packages = [
  {
    name: "Single Session",
    price: "$150",
    features: [
      "60-minute session",
      "Goal setting & action plan",
      "Email support for 1 week",
    ],
    highlighted: false,
  },
  {
    name: "Monthly Package",
    price: "$500",
    badge: "MOST POPULAR",
    features: [
      "4 sessions per month",
      "Priority scheduling",
      "Unlimited email support",
      "Custom resources & tools",
    ],
    highlighted: true,
  },
  {
    name: "Transformation",
    price: "$1,200",
    features: [
      "12-week personalized program",
      "Weekly sessions & homework",
      "Phone & email support",
    ],
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Coaching Packages
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`rounded-xl shadow-lg p-8 hover:shadow-2xl transition ${
                pkg.highlighted
                  ? "bg-gradient-to-br from-purple-600 to-pink-500 transform scale-105"
                  : "bg-white transform hover:-translate-y-1"
              }`}
            >
              {pkg.badge && (
                <div className="bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  {pkg.badge}
                </div>
              )}
              <h3
                className={`text-2xl font-bold mb-4 ${
                  pkg.highlighted ? "text-white" : "text-gray-800"
                }`}
              >
                {pkg.name}
              </h3>
              <p
                className={`text-4xl font-bold mb-6 ${
                  pkg.highlighted ? "text-white" : "text-purple-600"
                }`}
              >
                {pkg.price}
              </p>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle
                      className={`h-5 w-5 mr-2 mt-1 ${
                        pkg.highlighted ? "text-white" : "text-purple-600"
                      }`}
                    />
                    <span
                      className={
                        pkg.highlighted ? "text-white" : "text-gray-600"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/booking"
                className={`block w-full text-center py-3 rounded-lg transition font-semibold ${
                  pkg.highlighted
                    ? "bg-white text-purple-600 hover:shadow-lg"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
