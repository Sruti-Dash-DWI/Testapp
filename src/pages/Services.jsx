import React from "react";
import { FaRobot, FaChartLine, FaTasks } from "react-icons/fa";
import GradientBackground from "../components/GradientBackground";

const services = [
  {
    icon: <FaRobot className="text-5xl text-purple-600 mb-4" />,
    title: "AI-DRIVEN WORKFLOWS",
    description:
      "Automate repetitive tasks and get smart suggestions for deadlines, priorities, and next steps.",
    gradient: "linear-gradient(to bottom, #ffffff 10%, #AE75DA 90%)",
  },
  {
    icon: <FaChartLine className="text-5xl text-blue-500 mb-4" />,
    title: "SMART DASHBOARDS",
    description:
      "Visualize progress with real-time insights, charts, and reports tailored to your team.",
    gradient: "linear-gradient(to bottom, #ffffff 0%, #3396D3 100%)",
  },
  {
    icon: <FaTasks className="text-5xl text-orange-400 mb-4" />,
    title: "TASK & PROJECT MANAGEMENT",
    description:
      "Create, assign, and track tasks effortlessly with flexible views - lists, boards, or timelines.",
    gradient: "linear-gradient(to bottom, #ffffff 0%, rgb(255,150,150) 100%)",
  },
  {
    icon: <FaRobot className="text-5xl text-purple-400 mb-4" />,
    title: "AI-DRIVEN WORKFLOWS",
    description:
      "Automate repetitive tasks and get smart suggestions for deadlines, priorities, and next steps.",
    gradient: "linear-gradient(to bottom, #ffffff 10%, #AE75DA 90%)",
  },
  {
    icon: <FaChartLine className="text-5xl text-blue-400 mb-4" />,
    title: "SMART DASHBOARDS",
    description:
      "Visualize progress with real-time insights, charts, and reports tailored to your team.",
    gradient: "linear-gradient(to bottom, #ffffff 0%, #3396D3 100%)",
  },
  {
    icon: <FaTasks className="text-5xl text-orange-400 mb-4" />,
    title: "TASK & PROJECT MANAGEMENT",
    description:
      "Create, assign, and track tasks effortlessly with flexible views - lists, boards, or timelines.",
    gradient: "linear-gradient(to bottom, #ffffff 0%, rgb(255,150,150) 100%)",
  },
];

const Services = () => {
  return (
    <>
      <GradientBackground />
      {/* Add grid pattern overlay */}
      <div
        className=""
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.5,
          zIndex: 0,
        }}
      />
      <div id="services" className=" overflow-auto">
        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-6xl font-bold text-purple-800 mb-8">
                Our Services
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="rounded-3xl shadow-xl overflow-hidden 
                    transition-all duration-300 hover:scale-105 hover:shadow-2xl
                    p-8 flex flex-col items-center"
                  style={{
                    background: service.gradient,
                    minHeight: "320px",
                  }}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
