// import React, { useEffect, useState } from "react";
// import {
//   Search,
//   ChevronDown,
//   MapPin,
//   Calendar,
//   ExternalLink,
//   Menu,
//   X,
// } from "lucide-react";
// import Navbar from "../components/Navbar";

// const QuotientLanding = () => {
//   const [dimensions, setDimensions] = useState({
//     // width: window.innerWidth,
//     // height: window.innerHeight,
//     width: typeof window !== "undefined" ? window.innerWidth : 1920,
//     height: typeof window !== "undefined" ? window.innerHeight : 1080,
//   });
//   const [activeColorIndex, setActiveColorIndex] = useState(0);

//   useEffect(() => {
//     const handleResize = () => {
//       setDimensions({ width: window.innerWidth, height: window.innerHeight });
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   useEffect(() => {
//     // Initial color is purple (index 0)
//     // Change to pink at 3s, blue at 6s, orange at 9s, green at 12s
//     // Change color when circle animation reaches center (15% of 3s = 0.45s after start)
//     const delays = [0, 3000, 6000, 9000, 12000]; // Start times for each color
//     const showDelay = 500; // When circle is visible at center
//     const timeouts = delays.map((delay, index) =>
//       setTimeout(() => setActiveColorIndex(index), delay + showDelay)
//     );

//     const mainInterval = setInterval(() => {
//       delays.forEach((delay, index) => {
//         setTimeout(() => setActiveColorIndex(index), delay + showDelay);
//       });
//     }, 15000);

//     return () => {
//       timeouts.forEach(t => clearTimeout(t));
//       clearInterval(mainInterval);
//     };
//   }, []);



//   // Adjust grid gap based on screen size
//   const gridSize =
//     dimensions.width < 640 ? 20 : dimensions.width < 1024 ? 30 : 40;
//   const colors = [
//     {
//       bg: "bg-purple-400",
//       blur: "bg-purple-300/20",
//       gradient: "from-purple-300 via-pink-50 to-purple-300",
//     },
//     {
//       bg: "bg-pink-400",
//       blur: "bg-pink-300/20",
//       gradient: "from-pink-300 via-pink-50 to-pink-300",
//     },
//     {
//       bg: "bg-blue-400",
//       blur: "bg-blue-300/20",
//       gradient: "from-blue-300 via-pink-50 to-blue-300",
//     },
//     {
//       bg: "bg-orange-400",
//       blur: "bg-orange-300/20",
//       gradient: "from-orange-300 via-pink-50 to-orange-300",
//     },
//     {
//       bg: "bg-green-400",
//       blur: "bg-green-300/20",
//       gradient: "from-green-300 via-pink-50 to-green-300",
//     },
//   ];

//   return (
//     // <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-50 to-purple-300 relative overflow-hidden">
//     <div
//       className={`min-h-screen bg-gradient-to-br ${colors[activeColorIndex].gradient} relative overflow-hidden transition-all duration-1000`}
//     >
//       {/* ✅ Responsive Grid Overlay */}
//       <svg
//         className="absolute inset-0"
//         width={dimensions.width}
//         height={dimensions.height}
//       >
//         {/* Vertical lines */}
//         {Array.from(
//           { length: Math.ceil(dimensions.width / gridSize) },
//           (_, i) => (
//             <line
//               key={`v-${i}`}
//               x1={i * gridSize}
//               y1="0"
//               x2={i * gridSize}
//               y2={dimensions.height}
//               stroke="#cacfdaff"
//               strokeOpacity="0.5"
//               strokeWidth="1"
//             />
//           )
//         )}

//         {/* Horizontal lines */}
//         {Array.from(
//           { length: Math.ceil(dimensions.height / gridSize) },
//           (_, i) => (
//             <line
//               key={`h-${i}`}
//               x1="0"
//               y1={i * gridSize}
//               x2={dimensions.width}
//               y2={i * gridSize}
//               stroke="#cacfdaff"
//               strokeOpacity="0.5"
//               strokeWidth="1"
//             />
//           )
//         )}
//       </svg>

//       {/* 🌸 Background decorative elements */}
//       {/* Top Right Corner - Color changing blur */}
//       <div
//         className={`absolute top-20 right-32 w-96 h-96 ${colors[activeColorIndex].blur} rounded-full blur-3xl transition-all duration-1000`}
//       />

//       {/* Bottom Left Corner - Color changing blur */}
//       <div
//         className={`absolute bottom-32 left-16 w-80 h-80 ${colors[activeColorIndex].blur} rounded-full blur-2xl transition-all duration-1000`}
//       />

//       <div className="absolute top-1/3 left-1/5 w-32 h-32 bg-pink-200/15 rounded-full blur-xl" />

//       {/* <div className="absolute top-20 right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
//       <div className="absolute bottom-32 left-16 w-80 h-80 bg-purple-300/10 rounded-full blur-2xl" />
//       <div className="absolute top-1/3 left-1/5 w-32 h-32 bg-pink-200/15 rounded-full blur-xl" /> */}

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         @keyframes slideLeftRight0 {
//           0% { transform: translateX(150%); opacity: 0; }
//           15% { transform: translateX(0); opacity: 1; }
//           35% { transform: translateX(0); opacity: 1; }
//           50% { transform: translateX(-150%); opacity: 0; }
//           100% { transform: translateX(-150%); opacity: 0; }
//         }
//         @keyframes slideLeftRight1 {
//           0% { transform: translateX(150%); opacity: 0; }
//           15% { transform: translateX(0); opacity: 1; }
//           35% { transform: translateX(0); opacity: 1; }
//           50% { transform: translateX(-150%); opacity: 0; }
//           100% { transform: translateX(-150%); opacity: 0; }
//         }
//         @keyframes slideLeftRight2 {
//           0% { transform: translateX(150%); opacity: 0; }
//           15% { transform: translateX(0); opacity: 1; }
//           35% { transform: translateX(0); opacity: 1; }
//           50% { transform: translateX(-150%); opacity: 0; }
//           100% { transform: translateX(-150%); opacity: 0; }
//         }
//         @keyframes slideLeftRight3 {
//           0% { transform: translateX(150%); opacity: 0; }
//           15% { transform: translateX(0); opacity: 1; }
//           35% { transform: translateX(0); opacity: 1; }
//           50% { transform: translateX(-150%); opacity: 0; }
//           100% { transform: translateX(-150%); opacity: 0; }
//         }
//         @keyframes slideLeftRight4 {
//           0% { transform: translateX(150%); opacity: 0; }
//           15% { transform: translateX(0); opacity: 1; }
//           35% { transform: translateX(0); opacity: 1; }
//           50% { transform: translateX(-150%); opacity: 0; }
//           100% { transform: translateX(-150%); opacity: 0; }
//         }
//       `,
//         }}
//       />

//       {/* 🌸 Main Content */}
//       <div className="container mx-auto px-6 pt-12 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//           {/* Left Content */}
//           <div className="space-y-8 text-center lg:text-left">
//             <div>
//               <p className="text-purple-600 font-semibold tracking-widest uppercase mb-6">
//                 TRANSFORM THE WAY YOU MANAGE PROJECTS
//               </p>
//               <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
//                 Accelerate your
//                 <br />
//                 workflow.
//               </h1>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 mb-50 justify-center lg:justify-start mt-25">
//               <button
//                 className="bg-gradient-to-r from-purple-300 to-purple-700 text-white px-8 py-3 rounded-full border border-purple-600

//        font-semibold flex items-center justify-center gap-2 shadow-lg
//        hover:opacity-90 transition w-auto mx-auto sm:mx-0"
//               >
//                 Get Started
//                 <ExternalLink className="w-4 h-4" />
//               </button>
//               <button className="text-purple-600 hover:text-purple-700 font-semibold px-8 py-4 transition-colors">
//                 Get a Live Demo
//               </button>
//             </div>

//             {/* Search Section */}
//             <div className="bg-white p-7 rounded-3xl shadow-lg">
//               <div className="flex flex-col md:flex-row gap-6 items-center">
//                 {/* Destination */}
//                 <div className="flex-1 w-full">
//                   <label className="block text-sm font-semibold text-pink-400 mb-2">
//                     Destination
//                   </label>
//                   <div className="flex items-center space-x-3">
//                     <MapPin className="w-5 h-5 text-purple-400" />
//                     <span className="text-gray-900 font-medium">
//                       Paris, France
//                     </span>
//                     <ChevronDown className="w-4 h-4 text-gray-600" />
//                   </div>
//                 </div>

//                 {/* Date */}
//                 <div className="flex-1 w-full">
//                   <label className="block text-sm font-semibold text-pink-400 mb-2">
//                     Date
//                   </label>
//                   <div className="flex items-center space-x-3">
//                     <Calendar className="w-5 h-5 text-purple-400" />
//                     <span className="text-gray-900 font-medium">
//                       17 July 2021
//                     </span>
//                     <ChevronDown className="w-4 h-4 text-gray-600" />
//                   </div>
//                 </div>

//                 {/* Search Button */}
//                 <div className="flex items-end w-full md:w-auto">
//                   <button className="bg-purple-400 text-white px-8 py-3 rounded-2xl font-semibold shadow-md w-full">
//                     Search
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Content (Profile Circle + Cards) */}
//           <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0">
//             <div className="relative w-[280px] sm:w-[400px] lg:w-[500px] h-[280px] sm:h-[400px] lg:h-[500px]">
//               <div
//                 className="absolute inset-0 w-full h-full rounded-full bg-purple-400"
//                 style={{ animation: "slideLeftRight0 15s infinite" }}
//               ></div>
//               <div
//                 className="absolute inset-0 w-full h-full rounded-full bg-pink-400"
//                 style={{
//                   animation: "slideLeftRight1 15s infinite",
//                   animationDelay: "3s",
//                 }}
//               ></div>
//               <div
//                 className="absolute inset-0 w-full h-full rounded-full bg-blue-400"
//                 style={{
//                   animation: "slideLeftRight2 15s infinite",
//                   animationDelay: "6s",
//                 }}
//               ></div>
//               <div
//                 className="absolute inset-0 w-full h-full rounded-full bg-orange-400"
//                 style={{
//                   animation: "slideLeftRight3 15s infinite",
//                   animationDelay: "9s",
//                 }}
//               ></div>
//               <div
//                 className="absolute inset-0 w-full h-full rounded-full bg-green-400"
//                 style={{
//                   animation: "slideLeftRight4 15s infinite",
//                   animationDelay: "12s",
//                 }}
//               ></div>
//               <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-purple-600/30 rounded-full shadow-2xl z-10">
//                 <div className="absolute inset-4 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 shadow-xl">
//                   <img
//                     src="/herogif.gif"
//                     alt="profile"
//                     className="w-full  object-cover"
//                   />
//                 </div>
//               </div>

//               {/* Floating Cards */}
//               <div className="absolute top-5 right-2 bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-2 shadow-xl border border-white/40 z-20">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-yellow-400 text-lg">⭐</span>
//                   <span className="font-bold text-gray-900 text-lg">4.8</span>
//                 </div>
//                 <p className="text-sm text-gray-500 font-medium">
//                   Satisfaction
//                 </p>
//               </div>

//               <div className="absolute top-40 -left-10 sm:left-[-20px] bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl border border-white/40 z-20">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-md">
//                     <svg
//                       className="w-6 h-6 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="text-lg font-bold text-gray-900">2K+</p>
//                     <p className="text-sm text-gray-500 font-medium">
//                       Projects
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="absolute bottom-2 right-6 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl border border-white/40 z-20">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center shadow-md">
//                     <svg
//                       className="w-6 h-6 text-white"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-gray-900">
//                       Product Designer
//                     </p>
//                     <p className="text-sm text-gray-500 font-medium">5 Years</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuotientLanding;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sun, Moon, Check, Zap, Shield, Cpu,
  Globe, Play, Users, Lock, Lightbulb,
  BarChart, ArrowRight, Activity, Layers, Star, Crown, Linkedin, Instagram, Facebook,
  Rocket, Sparkles, Users as UsersIcon, Lock as LockIcon, Zap as ZapIcon, Lightbulb as LightbulbIcon
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import 'animate.css';
import SubscriptionModal from '../components/SubscriptionModal';

const ScrollReveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-50px" }} 
    transition={{
      duration: 1,
      delay: delay,
      ease: [0.25, 0.4, 0.25, 1] 
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- Background Components ---

const StarBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050505]">
    {[...Array(60)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white rounded-full opacity-20"
        style={{
          width: Math.random() * 2 + 'px',
          height: Math.random() * 2 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
        }}
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: Math.random() * 5 + 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Add the SuccessPopup component inside the ContactModal component, before the return statement
const SuccessPopup = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
  >
    <div className="p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <svg
          className="h-10 w-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully</h3>
      <p className="text-gray-600 mb-6">
        Thank you for reaching out to Qora-AI.
        <br />
        Our team has received your message and will get back to you within one business day.
      </p>
      <button
        onClick={onClose}
        className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
      >
        Okay, Got It
      </button>
    </div>
  </motion.div>
);

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-slate-50">
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className="absolute inset-0 filter blur-[100px] opacity-60">
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-purple-300 rounded-full mix-blend-multiply opacity-50"
        />
        <motion.div
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 100, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute top-[20%] right-0 w-[40vw] h-[40vw] bg-blue-300 rounded-full mix-blend-multiply opacity-50"
        />
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute bottom-0 left-[20%] w-[60vw] h-[60vw] bg-pink-200 rounded-full mix-blend-multiply opacity-40"
        />
      </div>
    </div>
  );
};

// --- Card Wrapper ---

const TiltCard = ({ children, isDark, className, delay = 0 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 50, damping: 20 }); // Smoother physics
  const mouseYSpring = useSpring(y, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]); // Reduced angle
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <ScrollReveal delay={delay}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ y: -5 }}
        className={`relative p-8 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 ${className}
            ${isDark ? 'bg-slate-900/40 border-white/5 hover:border-purple-500/30' : 'bg-white/70 border-white/60 hover:border-blue-300/50 shadow-xl hover:shadow-2xl'}`}
      >
        <div style={{ transform: "translateZ(20px)" }}>{children}</div>
      </motion.div>
    </ScrollReveal>
  );
};

const SectionHeader = ({ title, subtitle, isDark }) => (
  <div className="text-center mb-16 relative z-10 overflow-hidden">
    <ScrollReveal>
      <h2 className={`text-5xl font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 80 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"
      />
      <p className={`text-lg font-medium tracking-widest uppercase opacity-60 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
        {Array.isArray(subtitle) ? subtitle.map((line, idx) => (
          <div key={idx}>{line}</div>
        )) : subtitle}
      </p>
    </ScrollReveal>
  </div>
);



const QORA_Landing = () => {
  const [isDark, setIsDark] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };


  const faqData = [
    {
      id: "left-1",
      question: "What is Qora-AI?",
      answer:
        "Qora-AI is an intelligent work management platform that helps teams plan, track, and deliver work in one unified workspace."
    },
    {
      id: "left-2",
      question: "Who should use Qora-AI?",
      answer:
        "Qora-AI is built for product teams, engineering teams, operations teams, startups, and organizations managing complex work across teams."
    },
    {
      id: "left-3",
      question: "Can Qora-AI replace multiple tools?",
      answer:
        "Yes. Qora-AI can replace tools for task tracking, sprint planning, documentation, timelines, and basic reporting."
    },
    {
      id: "left-4",
      question: "Is Qora-AI a project management tool?",
      answer:
        "Yes, but it goes beyond traditional project management by combining planning, execution, documentation, and multiple work views in one system."
    },
    {
      id: "left-5",
      question: "Does Qora-AI support Agile and Scrum workflows?",
      answer:
        "Yes. Qora-AI supports backlogs, sprints, epics, tasks, and subtasks, making it suitable for Agile, Scrum, and hybrid workflows."
    },
  ];

  const faqrightData = [
    {
      id: "right-1",
      question: "What views does Qora-AI offer?",
      answer:
        "Qora-AI offers Kanban Boards, Timeline (Gantt), Calendar, List, and Summary views—all powered by the same data."
    },
    {
      id: "right-2",
      question: "Can teams switch between views without duplicating work?",
      answer:
        "Yes. Tasks and projects stay synchronized across all views, so updates in one view reflect everywhere."
    },
    {
      id: "right-3",
      question: "Is Qora-AI suitable for remote teams?",
      answer:
        "Yes. Qora-AI is built for distributed teams, offering shared visibility and collaboration across locations."
    },
    {
      id: "right-4",
      question: "How can we see Qora-AI in action?",
      answer:
        "You can watch the full product demo or contact our team for a walkthrough tailored to your needs."
    },
    {
      id: "right-5",
      question: "Does Qora-AI support forms and work requests?",
      answer:
        "Yes. Qora-AI includes a form builder for feature requests, bug reports, incidents, and custom workflows."
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/mo",
      desc: "Perfect for individuals and small projects.",
      features: ["5 Projects", "Basic Analytics", "Community Support", "1GB Storage"],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "/mo",
      desc: "Ideal for growing teams and startups.",
      features: ["Unlimited Projects", "Neural Analytics", "Priority Support", "100GB Storage", "API Access"],
      cta: "Try Free",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For large organizations with specific needs.",
      features: ["Dedicated Infrastructure", "Custom AI Models", "24/7 Dedicated Support", "Unlimited Storage", "SSO & Security"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <>
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
      />
      <div className={`min-h-screen relative font-sans transition-colors duration-700 overflow-x-hidden
      ${isDark ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>


        <AnimatePresence mode='wait'>
          {isDark ? <StarBackground key="stars" /> : <AnimatedBackground key="blobs" />}
        </AnimatePresence>


        <nav className={`fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center backdrop-blur-md border-b transition-all duration-500
        ${isDark ? 'bg-black/50 border-white/5' : 'bg-white/60 border-white/40'}`}>
          <div className="text-sm font-black italic bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {/* Qora AI */}
            <img src="QORA_AI Logo.svg" alt="Qora AI" className="w-45 h-auto" />
          </div>
          <div className="hidden md:flex gap-18 font-bold text-sm tracking-widest uppercase opacity-70">
            <a href="/" className="hover:text-blue-600 transition-colors relative group py-2">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/About" className="hover:text-blue-600 transition-colors relative group py-2">
              About us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/Services" className="hover:text-blue-600 transition-colors relative group py-2">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/contact" className="hover:text-blue-600 transition-colors relative group py-2">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full hover:bg-black/5 transition-colors">
              {isDark ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-600" />}
            </button>
            <button
              onClick={() => setIsSubscriptionOpen(true)}
              className="px-5 py-2 font-bold transition-transform hover:scale-105 active:scale-95 flex item-center gap-2"
            >
              <Crown className="text-purple-600 font-bold" />
              Subscribe
            </button>
            <Link to="/signup">
              <button className={`px-5 py-2 rounded-full font-bold transition-transform hover:scale-105 active:scale-95
            ${isDark ? 'bg-purple-600 text-white' : 'border border-purple bg-white text-purple'}`}>
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button className={`px-6 py-2 rounded-full font-bold transition-transform hover:scale-105 active:scale-95
            ${isDark ? 'bg-purple-600 text-white' : 'bg-slate-900 text-white'}`}>
                Log In
              </button>
            </Link>
          </div>
        </nav>

        {/* 1. HERO SECTION */}
        <section className="min-h-screen pt-20 px-6 relative z-10 block">
          <div className="max-w-7xl mx-auto overflow-hidden">

            {/* Left Block - Text Content */}
            <div className="inline-block w-full lg:w-[48%] align-middle lg:mr-[2%] text-center lg:text-left">
              <h1 className="text-6xl md:text-8xl py-5 font-black leading-tight mb-10 tracking-tighter animate__animated animate__fadeInUp">
                One Intelligent Workspace <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#047BC2] to-[#7F1592]">
                  for Modern Teams
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={`text-xl mb-12 leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}
              >
                Qora-AI brings projects, tasks, timelines, and team collaboration into one intelligent workspace.
                Plan faster, stay aligned, and deliver with complete visibility.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mb-10"
              >
                <Link to="/signup" className="inline-block mr-4">
                  <button className="px-8 py-4 rounded-full bg-slate-900 text-white font-semibold shadow-2xl transition-all hover:-translate-y-1">
                    Get Started
                  </button>
                </Link>
                <Link to="/contact" className="inline-block">
                  <button className={`px-8 py-4 rounded-full flex items-center gap-2 border font-semibold transition-all hover:-translate-y-1 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/40 border-slate-200'}`}>
                    Contact Us <ArrowRight />
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Right Block - Image Content */}
            <div
              className="inline-block w-full lg:w-[50%] align-middle mt-12 lg:mt-0 text-center"
              /* Increased negative Y value to pull the image higher */
              style={{ transform: 'translate(0px, -60px)' }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="relative inline-block w-full"
              >
                <div className={`relative rounded-[2.5rem] p-5 border backdrop-blur-xl inline-block
      ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-blue-200/30 border-blue-200/30'}`}>
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                    className="rounded-[2rem] w-full max-w-lg object-cover shadow-lg"
                    alt="Dashboard"
                  />
                </div>

                {/* Floating Status Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className={`absolute -bottom-8 left-0 p-5 rounded-2xl shadow-xl flex items-center gap-4 border backdrop-blur-md text-left
          ${isDark ? 'bg-slate-800/90 border-slate-600 text-white' : 'bg-white/90 border-white/50 text-slate-900'}`}
                >
                  <div className="bg-green-500/10 text-green-600 p-2.5 rounded-xl"><Check size={20} /></div>
                  <div>
                    <div className="font-bold text-sm">System Optimal</div>
                    <div className="text-[10px] opacity-60 uppercase tracking-wider">All nodes active</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* 2. ABOUT US */}
        {/* <section className={`py-32 px-6 relative z-10 ${isDark ? 'bg-black/20' : 'bg-white/20'}`}>
        <SectionHeader title="About Us" subtitle="The Quotient Story" isDark={isDark} />

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center mb-24">
            <ScrollReveal>
              <h3 className={`text-4xl font-bold mb-8 leading-tight ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>
                Reimagining the <br />
                Future of Work.
              </h3>
              <p className="text-lg opacity-70 leading-relaxed mb-6">
                At Quotient, we believe productivity isn't about doing more—it's about working smarter.
                Our mission is to empower teams with intelligent tools that simplify work, foster collaboration,
                and turn ideas into impact.
              </p>
              <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest opacity-60">
                <span>Since 2024</span>
                <span className="w-1 h-1 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span>Global Team</span>
              </div>
            </ScrollReveal>
            <TiltCard isDark={isDark} delay={0.2}>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" className="rounded-2xl shadow-lg grayscale hover:grayscale-0 transition-all duration-700" alt="Team" />
            </TiltCard>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <TiltCard isDark={isDark} delay={0.3}>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>Our Story</h3>
              <p className="opacity-70 leading-relaxed text-sm">
                Quotient was born from a simple idea: managing projects shouldn't be chaotic.
                We set out to create an intuitive, AI-driven workspace where teams can plan, collaborate,
                and execute seamlessly.
              </p>
            </TiltCard>
            <TiltCard isDark={isDark} delay={0.4}>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>Our Mission</h3>
              <p className="opacity-70 leading-relaxed text-sm">
                To maximize teamwork by combining innovation, automation, and simplicity.
                Helping organizations achieve more with clarity and focus.
              </p>
            </TiltCard>
          </div>
        </div>
      </section> */}

        {/* 3. VIDEO DEMO SECTION */}
        <section className="py-32 px-6 relative z-10">
          <SectionHeader title="See It In Action" subtitle="Command Center Demo" isDark={isDark} />
          <div className="max-w-5xl mx-auto">
            <TiltCard isDark={isDark} className="p-3!">
              <div className="aspect-video bg-black rounded-[1.5rem] relative overflow-hidden group cursor-pointer shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 ease-out"
                  alt="Video Thumbnail"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl pl-1">
                      <Play className="text-blue-600 fill-blue-600" size={28} />
                    </div>
                  </motion.div>
                </div>
                <div className="absolute bottom-8 left-8 flex items-center gap-3">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-white font-mono text-sm tracking-wide">Create_Task_Sequence.mp4</span>
                </div>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* 4. OUR VALUES */}
        <section className={`py-10 px-6 relative z-10 ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
          <SectionHeader title="Our Values" subtitle="The Pillars of QORA-AI" isDark={isDark} />
          <div className="max-w-7xl min-h-[150px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-15 text-center items-stretch">
            {[
              {
                title: "Clarity Over Complexity",
                icon: <LightbulbIcon className="w-8 h-8 text-yellow-500 fill-yellow-500/20" strokeWidth={1.5} />,
                color: "text-red-500",
                description: "Work should feel simple, not overwhelming. We design Qora-AI to reduce noise, highlight priorities, and make progress visible at every step."
              },
              {
                title: "Built for Real Teams",
                icon: <UsersIcon className="w-8 h-8 text-purple-500 fill-purple-500/20" strokeWidth={1.5} />,
                color: "text-blue-500",
                description: "Qora-AI is designed around how teams actually work-planning together, executing daily tasks, and staying aligned without constant meetings."
              },
              {
                title: "Flexibility Without Chaos",
                icon: <ZapIcon className="w-8 h-8 text-blue-500 fill-blue-500/20" strokeWidth={1.5} />,
                color: "text-blue-500",
                description: "Different teams work differently. Qora-AI adapts to your workflow while keeping structure, ownership, and accountability intact."
              },
              {
                title: "Progress You Can Trust",
                icon: <LockIcon className="w-8 h-8 text-green-500 fill-green-500/20" strokeWidth={1.5} />,
                color: "text-green-500",
                description: "From daily tasks to long-term plans, Qora-AI gives you reliable visibility into what's moving forward and what needs attention."
              }
            ].map((val, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className={`p-10 rounded-3xl flex flex-col items-center gap-5 border-2 transition-all duration-300 cursor-default h-full
                    ${isDark ? 'bg-slate-900/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600' : 'bg-white/60 border-blue-100 hover:shadow-xl hover:border-blue-300'}`}
                >
                  <div className={`p-4 rounded-2xl ${val.color.replace('text', 'bg')}/10 flex items-center justify-center`}>
                    {val.icon}
                  </div>
                  <h3 className={'text-lg font-bold'}>{val.title}</h3>
                  <p className="text-sm opacity-70">
                    {val.description || 'Description not available.'}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* 5. OUR SERVICES 
       <section className="py-32 px-6 relative z-10">
        <SectionHeader title="Our Services" subtitle="Capabilities" isDark={isDark} />
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: "AI-Driven Workflows", icon: <Cpu />, bg: "from-purple-500 to-indigo-500" },
            { title: "Smart Dashboards", icon: <BarChart />, bg: "from-blue-400 to-cyan-400" },
            { title: "Task Management", icon: <Layers />, bg: "from-pink-500 to-rose-500" },
            { title: "Team Synergy", icon: <Users />, bg: "from-orange-400 to-amber-400" },
            { title: "Cloud Security", icon: <Shield />, bg: "from-emerald-400 to-green-400" },
            { title: "Global Scale", icon: <Globe />, bg: "from-fuchsia-500 to-purple-500" },
          ].map((service, i) => (
            <TiltCard key={i} isDark={isDark} delay={i * 0.1} className="group overflow-hidden">
              <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${service.bg} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.bg} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="opacity-60 text-sm leading-relaxed">
                Automate super-tasks and prevent bottlenecks with our advanced neural engine.
              </p>
            </TiltCard>
          ))}
        </div>
      </section> */}

        {/* 6. SUBSCRIPTION/PRICING SECTION */}
        {/* <section className={`py-32 px-6 relative z-10 ${isDark ? 'bg-black/40' : 'bg-white/40'}`}>
        <SectionHeader title="Plans & Pricing" subtitle="Scale with your team" isDark={isDark} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -15 }}
                className={`relative p-10 rounded-[2.5rem] border backdrop-blur-2xl flex flex-col h-full transition-all duration-500
                        ${isDark
                    ? 'bg-slate-900/60 border-slate-700 hover:border-purple-500/50'
                    : 'bg-white/70 border-white hover:border-blue-400/50 shadow-xl hover:shadow-2xl'}
                        ${plan.popular ? (isDark ? 'border-purple-500/50 shadow-purple-900/20' : 'border-blue-500/50 shadow-blue-500/20') : ''}
                        `}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                  <p className="text-sm opacity-60 min-h-[40px] leading-relaxed">{plan.desc}</p>
                </div>

                <div className="mb-10">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                    <span className="text-sm opacity-50 font-medium">{plan.period}</span>
                  </div>
                </div>

                <div className="flex-grow space-y-4 mb-10">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-medium opacity-80">
                      <div className={`p-0.5 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-100 text-blue-600'}`}>
                        <Check size={12} strokeWidth={4} />
                      </div>
                      {feat}
                    </div>
                  ))}
                </div>

                <button className={`w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wide
                            ${plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : (isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200')}
                        `}>
                  {plan.cta} {plan.popular && <Rocket size={14} />}
                </button>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section> */}

        {/* 7. FAQ's */}
        {/* <section className={`py-12 px-6 relative z-10 ${isDark ? 'bg-black/10' : 'bg-transparent'}`}>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Frequently asked questions
          </h2>
          <p className={`text-lg ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            Quick answers to common questions about Qora-AI.
          </p>
        </div>
        
          <div className="max-w-7xl h-full mx-auto gap-4 space-y-4 flex flex-row">
            <div className="w-[50%] h-full flex flex-col">
               {faqData.map((faq) => (
                <div key={faq.id} className="mb-4 break-inside-avoid">
                  <div className={`p-6 rounded-2xl min-h-[90px] ${isDark ? 'bg-white/10' : 'bg-white'} shadow-lg`}>
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex justify-between items-center text-left"
                    >
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {faq.question}
                      </h3>

                      <div className={`transition-transform ${openFAQ === faq.id ? 'rotate-180' : ''}`}>
                        ▼
                      </div>
                    </button>

                    <AnimatePresence>
                      {openFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 text-sm">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-[50%] h-full flex flex-col">
              {faqrightData.map((faq) => (
                <div key={faq.id} className="mb-4 break-inside-avoid">
                  <div className={`p-6 rounded-2xl min-h-[90px] ${isDark ? 'bg-white/10' : 'bg-white'} shadow-lg`}>
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex justify-between items-center text-left"
                    >
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {faq.question}
                      </h3>

                      <div className={`transition-transform ${openFAQ === faq.id ? 'rotate-180' : ''}`}>
                        ▼
                      </div>
                    </button>

                    <AnimatePresence>
                      {openFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 text-sm">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section> */}

        {/* 7.5 GET STARTED SECTION */}
        <section className={`min-h-[50vh] flex items-center justify-center py-12 px-6 relative z-10 ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
          <div className="max-w-4xl w-full text-center">
            <h2 className={`text-4xl md:text-5xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Ready to get started?
            </h2>
            <p className={`text-xl mb-10 max-w-2xl mx-auto ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Join thousands of teams already using Qora-AI to be more productive.
            </p>
            <div className="flex justify-center">
              <Link to="/signup" className="inline-block">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  Get Started <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* 8. FOOTER */}
        <footer className={`py-5 px-6 relative z-10 border-t ${isDark ? 'bg-black border-white/5' : 'bg-white border-slate-100'}`}>
          <ScrollReveal>
            <div className="max-w-7xl mt-2 mx-auto grid md:grid-cols-5 gap-5">
              <div>
                <h2 className="text-2xl font-black mb-6 tracking-tighter">QORA-AI</h2>
                <p className="opacity-60 text-sm leading-relaxed">Qora-AI is an intelligent workspace that helps teams plan, track, and deliver work with clarity-bringing projects, collaboration, and visibility into one unified platform.</p>
              </div>
              <div>
                <h4 className={`font-bold mb-6 text-sm uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>Product</h4>
                <ul className="space-y-3 opacity-60 text-sm">
                  <li className="hover:opacity-100 transition-opacity">
                    <a href="/" className="hover:text-blue-600 transition-colors relative group py-2">
                      Home
                    </a>
                  </li>
                  <li className="hover:opacity-100 transition-opacity">
                    <a href="/about" className="hover:text-blue-600 transition-colors relative group py-2">
                      About
                    </a>
                  </li>
                  <li className="hover:opacity-100 transition-opacity">
                    <a href="/services" className="hover:text-blue-600 transition-colors relative group py-2">
                      Services
                    </a>
                  </li>
                  <li className="hover:opacity-100 transition-opacity">
                    {/* <a href="/" className="hover:text-blue-600 transition-colors relative group py-2" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Product Demo</a> */}
                    <a href="/" className="hover:text-blue-600 transition-colors relative group py-2">
                      Project Demo
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className={`font-bold mb-6 text-sm uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>Resources</h4>
                <ul className="space-y-3 opacity-60 text-sm">
                  <li className="hover:opacity-100 transition-opacity">
                    <a href="/about" className="hover:text-blue-600 transition-colors relative group py-2">
                      FAQ's
                    </a>
                  </li>
                  <li className="hover:opacity-100 transition-opacity">
                    <a href="/contact" className="hover:text-blue-600 transition-colors relative group py-2">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className={`font-bold mb-6 text-sm uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>Company</h4>
                <ul className="space-y-3 opacity-60 text-sm">
                  <li className="hover:opacity-100 transition-opacity">
                    <a href="/about" className="hover:text-blue-600 transition-colors relative group py-2">
                      About Qora-AI
                    </a>
                  </li>
                  <li className="hover:opacity-100 transition-opacity">
                    <Link to="/privacy" className="hover:opacity-100" onClick={() => window.scrollTo(0, 0)}>Privacy Policy</Link>
                  </li>
                  <li className="hover:opacity-100 transition-opacity">
                    <Link to="/terms" className="hover:opacity-100" onClick={() => window.scrollTo(0, 0)}>Terms of Service</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className={`font-bold mb-6 text-sm uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>Contact</h4>
                <div className="space-y-3 text-sm opacity-60">
                  <div className="flex items-center gap-2">
                    <span>support@qora-ai.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span> +91 9348229679</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span> Mon-Fri, 10 AM-6 PM IST</span>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <a
                      href="#"
                      className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-white" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-12 font-bold pt-8 border-t border-current border-opacity-10 opacity-40 text-xs">
              &copy; 2026 QORA-AI. All rights reserved.
            </div>
          </ScrollReveal>
        </footer>

      </div>
    </>
  );
};
export { SectionHeader, TiltCard, ScrollReveal };

export default QORA_Landing;