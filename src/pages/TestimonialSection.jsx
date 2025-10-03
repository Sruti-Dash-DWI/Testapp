import React from "react";

const TestimonialSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-50 to-purple-200 flex items-center justify-center px-8 py-16">
      <div className="max-w-6xl w-full">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-200 backdrop-blur-sm px-7 py-3  mb-10">
            <span className="text-purple-800 font-semibold text-5xl">
              Our Reach
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-purple-900 mb-6 leading-tight">
            What people say about us!
          </h1>

          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut la
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Left Card - Empty placeholder */}
          <div className="bg-white/50 backdrop-blur-sm border-2 border-purple-300 rounded-2xl p-8 h-80 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-purple-50/80 to-pink-50/60 rounded-xl"></div>
          </div>

          {/* Center Card - Main Testimonial */}
          <div className="bg-white/50 backdrop-blur-sm border-2 border-purple-300 rounded-2xl p-8 h-80 flex flex-col justify-center text-center">
            <div className="text-6xl text-purple-600 mb-4 leading-none font-serif">
              "
            </div>
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div>
              <h4 className="text-purple-700 font-semibold text-lg">Angela</h4>
              <p className="text-gray-500 text-sm">CEO - Market Movers</p>
            </div>
          </div>

          {/* Right Card - Empty placeholder */}
          <div className="bg-white/50 backdrop-blur-sm border-2 border-purple-300 rounded-2xl p-8 h-80 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-purple-50/80 to-pink-50/60 rounded-xl"></div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
