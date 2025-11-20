import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transform Your Life
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Unlock your potential with personalized life coaching
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Book Your Free Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
