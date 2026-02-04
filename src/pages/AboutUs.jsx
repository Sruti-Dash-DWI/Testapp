import React, {useState} from "react";
import { SectionHeader, TiltCard, ScrollReveal } from "./Landing";
import { Link } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';
import {
  Sun, Moon, Check, Zap, Shield, Cpu,
  Globe, Play, Users, Lock, Lightbulb,
  BarChart, ArrowRight, Activity, Layers, Star, Crown, Linkedin, Instagram, Facebook,
  Rocket, Sparkles, Users as UsersIcon, Lock as LockIcon, Zap as ZapIcon, Lightbulb as LightbulbIcon
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import 'animate.css';
import SubscriptionModal from '../components/SubscriptionModal';

const StarBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-[#050505]">
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

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

const AboutUs = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  
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
          <div className="text-sm font-black italic">
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

        <section className={`py-15 pt-30 px-6 relative z-10 ${isDark ? 'bg-black/20' : 'bg-white/20'}`}>
          <SectionHeader title="About Qora-AI" subtitle={["Qora-AI is built to help teams work with clarity", "bringing planning, execution, and collaboration into one unified workspace."]} isDark={isDark} />

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center mb-24">
              <ScrollReveal>
                <h3 className={`text-4xl font-bold mb-8 leading-tight ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>
                  Reimagining the Future<br /> of Work.
                </h3>
                <p className="text-lg opacity-70 leading-relaxed mb-6">
                  At QORA-AI, we believe productivity isn't about doing more-it's about working smarter.
                  Our mission is to empower teams with intelligent tools that simplify work, foster collaboration,
                  and turn ideas into impact.
                </p>
              </ScrollReveal>
              <TiltCard isDark={isDark} delay={0.2}>
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" className="rounded-2xl shadow-lg grayscale hover:grayscale-0 transition-all duration-700" alt="Team" />
              </TiltCard>
            </div>

            <div className="grid md:grid-cols-2 gap-20 items-center mb-24">
              <div>
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" className="rounded-2xl shadow-lg grayscale hover:grayscale-0 transition-all duration-700" alt="Team" />
              </div>
              <ScrollReveal>
                <p className="text-lg opacity-70 leading-relaxed mb-6">
                  QORA-AI provides a structured work management platform designed to help teams plan, track, and manage work throughout its lifecycle. The platform offers a visual workflow that enables clear task ownership, well-defined state transitions, and real-time progress visibility.
                </p>
              </ScrollReveal>
            </div>

            <div className="grid md:grid-cols-2 gap-20 items-center mb-24">
              <ScrollReveal>
                <p className="text-lg opacity-70 leading-relaxed mb-6">
                  With integrated test case management, QORA-AI allows teams to create, organize, and validate test scenarios alongside ongoing work. This ensures strong traceability between requirements, execution, and outcomes, helping teams maintain consistent quality and reduce gaps between delivery and validation processes.
                </p>
              </ScrollReveal>
              <TiltCard isDark={isDark} delay={0.2}>
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" className="rounded-2xl shadow-lg grayscale hover:grayscale-0 transition-all duration-700" alt="Team" />
              </TiltCard>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <TiltCard isDark={isDark} delay={0.3} className="h-full flex flex-col">
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>Our Story</h3>
                <p className="opacity-70 leading-relaxed text-sm flex-grow">
                  QORA-AI was created to solve the challenge of managing work with clarity as teams and workflows grow more complex. Many existing tools address only parts of the process, leaving gaps between planning, execution, and validation. QORA-AI brings these elements together into a structured, unified platform that supports clear visibility, accountability, and reliable outcomes.
                </p>
              </TiltCard>
              <TiltCard isDark={isDark} delay={0.4} className="h-full flex flex-col">
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>Our Mission</h3>
                <p className="opacity-70 leading-relaxed text-sm flex-grow">
                  Our mission is to help teams work more effectively by providing a structured system that simplifies how work is planned, tracked, and validated. QORA-AI focuses on enabling consistency, collaboration, and transparency, allowing teams to deliver high-quality results while adapting to evolving workflows.
                </p>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
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

        {/* Footer */}
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

export default AboutUs;
