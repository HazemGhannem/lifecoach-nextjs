import { CheckCircle, Star } from "lucide-react";

export default function AboutSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Meet Sarah Miller
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            With over 10 years of experience in life coaching and personal
            development, I help individuals discover their true potential and
            create meaningful change in their lives.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            My holistic approach combines proven coaching techniques with
            mindfulness practices to help you achieve your goals and live a more
            fulfilling life.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-3" />
              <span className="text-gray-700">
                Certified Professional Life Coach
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-3" />
              <span className="text-gray-700">500+ Clients Transformed</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-3" />
              <span className="text-gray-700">
                Specializing in Career & Personal Growth
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 h-96 flex items-center justify-center">
          <div className="text-center">
            <Star className="h-24 w-24 text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 italic">
              "Sarah changed my life completely!"
            </p>
            <p className="text-sm text-gray-500 mt-2">- Happy Client</p>
          </div>
        </div>
      </div>
    </div>
  );
}
