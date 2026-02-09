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
import { useTheme } from '../context/ThemeContext';

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
  const { isDark, toggleTheme } = useTheme();
  // const [openFAQ, setOpenFAQ] = useState(null);
  // const [isContactOpen, setIsContactOpen] = useState(false);
  // const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  return (
    <>
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
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 transition-colors">
              {isDark ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-600" />}
            </button>
            <Link to ="/subscriptions">
            <button
              className="px-5 py-2 font-bold transition-transform hover:scale-105 active:scale-95 flex item-center gap-2"
            >
              <Crown className="text-purple-600 font-bold" />
              Subscribe
            </button>
            </Link>
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

        {/* 7. GET STARTED SECTION */}
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