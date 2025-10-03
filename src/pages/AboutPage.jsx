import { Lightbulb, Users, Circle, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-50 p-16">
      <div className="max-w-7xl mx-auto">
        {/* Top Section - Our Story and Our Mission */}
        <div className="grid grid-cols-2 gap-32 mb-20">
          {/* Our Story */}
          <div>
            <h1 className="text-6xl font-bold text-purple-800 mb-6">
              Our Story
            </h1>
            <p className="text-gray-700 text-xl leading-relaxed font-medium">
              Quotient was born from a simple idea: managing projects shouldn't
              be chaotic. We set out to create an intuitive, AI-driven workspace
              where teams can plan, collaborate, and execute seamlessly — all in
              one place.
            </p>
          </div>

          {/* Our Mission */}
          <div>
            <h1 className="text-6xl font-bold text-purple-800 mb-6">
              Our Mission
            </h1>
            <p className="text-gray-700 text-xl leading-relaxed font-medium">
              To transform teamwork by combining innovation, automation, and
              simplicity — helping organizations achieve more with clarity and
              focus.
            </p>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-purple-800 mb-20">
            Our Values
          </h1>

          {/* Values Grid - 2x2 */}
          <div className="grid grid-cols-2 gap-20 max-w-5xl mx-auto">
            {/* Innovation First */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-200 rounded-2xl flex items-center justify-center mb-8 border border-purple-300">
                <Lightbulb
                  className="w-12 h-12 text-yellow-600 fill-yellow-200"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-3xl font-bold text-purple-800 mb-3">
                Innovation First
              </h3>
              <div className="text-purple-400 text-sm">💡 ope...</div>
            </div>

            {/* Collaboration */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-200 rounded-2xl flex items-center justify-center mb-8 border border-purple-300">
                <Users
                  className="w-12 h-12 text-purple-600"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-3xl font-bold text-purple-800 mb-3">
                Collaboration
              </h3>
              <div className="text-purple-400 text-sm">🤝 cod...</div>
            </div>

            {/* Simplicity */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-200 rounded-2xl flex items-center justify-center mb-8 border border-yellow-300">
                <Circle className="w-12 h-12 text-orange-500" strokeWidth={2} />
              </div>
              <h3 className="text-3xl font-bold text-purple-800 mb-3">
                Simplicity
              </h3>
            </div>

            {/* Trust & Security */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mb-8 border border-orange-200">
                <Shield
                  className="w-12 h-12 text-orange-500 fill-orange-100"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-3xl font-bold text-purple-800 mb-3">
                Trust & Security
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
