import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  MapPin,
  Calendar,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
 
const QuotientLanding = () => {
  const [dimensions, setDimensions] = useState({
    // width: window.innerWidth,
    // height: window.innerHeight,
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });
  const [activeColorIndex, setActiveColorIndex] = useState(0);
 
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    // Initial color is purple (index 0)
    // Change to pink at 3s, blue at 6s, orange at 9s, green at 12s
    // Change color when circle animation reaches center (15% of 3s = 0.45s after start)
    const delays = [0, 3000, 6000, 9000, 12000]; // Start times for each color
    const showDelay = 500; // When circle is visible at center
    const timeouts = delays.map((delay, index) =>
      setTimeout(() => setActiveColorIndex(index), delay + showDelay)
    );
   
    const mainInterval = setInterval(() => {
      delays.forEach((delay, index) => {
        setTimeout(() => setActiveColorIndex(index), delay + showDelay);
      });
    }, 15000);
   
    return () => {
      timeouts.forEach(t => clearTimeout(t));
      clearInterval(mainInterval);
    };
  }, []);
 
 
 
  // Adjust grid gap based on screen size
  const gridSize =
    dimensions.width < 640 ? 20 : dimensions.width < 1024 ? 30 : 40;
  const colors = [
    {
      bg: "bg-purple-400",
      blur: "bg-purple-300/20",
      gradient: "from-purple-300 via-pink-50 to-purple-300",
    },
    {
      bg: "bg-pink-400",
      blur: "bg-pink-300/20",
      gradient: "from-pink-300 via-pink-50 to-pink-300",
    },
    {
      bg: "bg-blue-400",
      blur: "bg-blue-300/20",
      gradient: "from-blue-300 via-pink-50 to-blue-300",
    },
    {
      bg: "bg-orange-400",
      blur: "bg-orange-300/20",
      gradient: "from-orange-300 via-pink-50 to-orange-300",
    },
    {
      bg: "bg-green-400",
      blur: "bg-green-300/20",
      gradient: "from-green-300 via-pink-50 to-green-300",
    },
  ];
 
  return (
    // <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-50 to-purple-300 relative overflow-hidden">
    <div
      className={`min-h-screen bg-gradient-to-br ${colors[activeColorIndex].gradient} relative overflow-hidden transition-all duration-1000`}
    >
      {/* ✅ Responsive Grid Overlay */}
      <svg
        className="absolute inset-0"
        width={dimensions.width}
        height={dimensions.height}
      >
        {/* Vertical lines */}
        {Array.from(
          { length: Math.ceil(dimensions.width / gridSize) },
          (_, i) => (
            <line
              key={`v-${i}`}
              x1={i * gridSize}
              y1="0"
              x2={i * gridSize}
              y2={dimensions.height}
              stroke="#cacfdaff"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
          )
        )}
 
        {/* Horizontal lines */}
        {Array.from(
          { length: Math.ceil(dimensions.height / gridSize) },
          (_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * gridSize}
              x2={dimensions.width}
              y2={i * gridSize}
              stroke="#cacfdaff"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
          )
        )}
      </svg>
 
      {/* 🌸 Background decorative elements */}
      {/* Top Right Corner - Color changing blur */}
      <div
        className={`absolute top-20 right-32 w-96 h-96 ${colors[activeColorIndex].blur} rounded-full blur-3xl transition-all duration-1000`}
      />
 
      {/* Bottom Left Corner - Color changing blur */}
      <div
        className={`absolute bottom-32 left-16 w-80 h-80 ${colors[activeColorIndex].blur} rounded-full blur-2xl transition-all duration-1000`}
      />
 
      <div className="absolute top-1/3 left-1/5 w-32 h-32 bg-pink-200/15 rounded-full blur-xl" />
 
      {/* <div className="absolute top-20 right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-32 left-16 w-80 h-80 bg-purple-300/10 rounded-full blur-2xl" />
      <div className="absolute top-1/3 left-1/5 w-32 h-32 bg-pink-200/15 rounded-full blur-xl" /> */}
 
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideLeftRight0 {
          0% { transform: translateX(150%); opacity: 0; }
          15% { transform: translateX(0); opacity: 1; }
          35% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-150%); opacity: 0; }
          100% { transform: translateX(-150%); opacity: 0; }
        }
        @keyframes slideLeftRight1 {
          0% { transform: translateX(150%); opacity: 0; }
          15% { transform: translateX(0); opacity: 1; }
          35% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-150%); opacity: 0; }
          100% { transform: translateX(-150%); opacity: 0; }
        }
        @keyframes slideLeftRight2 {
          0% { transform: translateX(150%); opacity: 0; }
          15% { transform: translateX(0); opacity: 1; }
          35% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-150%); opacity: 0; }
          100% { transform: translateX(-150%); opacity: 0; }
        }
        @keyframes slideLeftRight3 {
          0% { transform: translateX(150%); opacity: 0; }
          15% { transform: translateX(0); opacity: 1; }
          35% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-150%); opacity: 0; }
          100% { transform: translateX(-150%); opacity: 0; }
        }
        @keyframes slideLeftRight4 {
          0% { transform: translateX(150%); opacity: 0; }
          15% { transform: translateX(0); opacity: 1; }
          35% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-150%); opacity: 0; }
          100% { transform: translateX(-150%); opacity: 0; }
        }
      `,
        }}
      />
 
      {/* 🌸 Main Content */}
      <div className="container mx-auto px-6 pt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div>
              <p className="text-purple-600 font-semibold tracking-widest uppercase mb-6">
                TRANSFORM THE WAY YOU MANAGE PROJECTS
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
                Accelerate your
                <br />
                workflow.
              </h1>
            </div>
 
            <div className="flex flex-col sm:flex-row gap-4 mb-50 justify-center lg:justify-start mt-25">
              <button
                className="bg-gradient-to-r from-purple-300 to-purple-700 text-white px-8 py-3 rounded-full border border-purple-600
 
       font-semibold flex items-center justify-center gap-2 shadow-lg
       hover:opacity-90 transition w-auto mx-auto sm:mx-0"
              >
                Get Started
                <ExternalLink className="w-4 h-4" />
              </button>
              <button className="text-purple-600 hover:text-purple-700 font-semibold px-8 py-4 transition-colors">
                Get a Live Demo
              </button>
            </div>
 
            {/* Search Section */}
            <div className="bg-white p-7 rounded-3xl shadow-lg">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Destination */}
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold text-pink-400 mb-2">
                    Destination
                  </label>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-900 font-medium">
                      Paris, France
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
 
                {/* Date */}
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold text-pink-400 mb-2">
                    Date
                  </label>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-900 font-medium">
                      17 July 2021
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
 
                {/* Search Button */}
                <div className="flex items-end w-full md:w-auto">
                  <button className="bg-purple-400 text-white px-8 py-3 rounded-2xl font-semibold shadow-md w-full">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
 
          {/* Right Content (Profile Circle + Cards) */}
          <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative w-[280px] sm:w-[400px] lg:w-[500px] h-[280px] sm:h-[400px] lg:h-[500px]">
              <div
                className="absolute inset-0 w-full h-full rounded-full bg-purple-400"
                style={{ animation: "slideLeftRight0 15s infinite" }}
              ></div>
              <div
                className="absolute inset-0 w-full h-full rounded-full bg-pink-400"
                style={{
                  animation: "slideLeftRight1 15s infinite",
                  animationDelay: "3s",
                }}
              ></div>
              <div
                className="absolute inset-0 w-full h-full rounded-full bg-blue-400"
                style={{
                  animation: "slideLeftRight2 15s infinite",
                  animationDelay: "6s",
                }}
              ></div>
              <div
                className="absolute inset-0 w-full h-full rounded-full bg-orange-400"
                style={{
                  animation: "slideLeftRight3 15s infinite",
                  animationDelay: "9s",
                }}
              ></div>
              <div
                className="absolute inset-0 w-full h-full rounded-full bg-green-400"
                style={{
                  animation: "slideLeftRight4 15s infinite",
                  animationDelay: "12s",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-purple-600/30 rounded-full shadow-2xl z-10">
                <div className="absolute inset-4 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 shadow-xl">
                  <img
                    src="/herogif.gif"
                    alt="profile"
                    className="w-full  object-cover"
                  />
                </div>
              </div>
 
              {/* Floating Cards */}
              <div className="absolute top-5 right-2 bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-2 shadow-xl border border-white/40 z-20">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="font-bold text-gray-900 text-lg">4.8</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Satisfaction
                </p>
              </div>
 
              <div className="absolute top-40 -left-10 sm:left-[-20px] bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl border border-white/40 z-20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">2K+</p>
                    <p className="text-sm text-gray-500 font-medium">
                      Projects
                    </p>
                  </div>
                </div>
              </div>
 
              <div className="absolute bottom-2 right-6 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl border border-white/40 z-20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center shadow-md">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Product Designer
                    </p>
                    <p className="text-sm text-gray-500 font-medium">5 Years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default QuotientLanding;
 
 