import React, { useState } from "react";
import { Cpu, BarChart, Layers, Users, Shield, Globe,ArrowRight, Linkedin, Instagram, Facebook, Sun, Moon, Crown } from "lucide-react";
import { SectionHeader, TiltCard, ScrollReveal } from "./Landing";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import SubscriptionModal from '../components/SubscriptionModal';
import { useTheme } from '../contexts/ThemeContext';

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

const Services = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  return (
    <>

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

        <section className={`pt-30 py-15 px-6 relative z-10 ${isDark ? 'bg-black/20' : 'bg-white/20'}`}>
      <SectionHeader title="How Qora-AI Helps Teams Get Work Done" subtitle={["From planning to execution and long-term visibility", "Qora-AI supports every stage of team workflows with clarity and structure."]} isDark={isDark} />
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          { 
            title: "Project & Sprint Management", 
            icon: <Cpu />, 
            bg: "from-purple-400 to-indigo-400",
            points: [
              "Manage multiple projects from a centralized workspace",
              "Plan backlogs, sprints, epics, tasks, and subtasks",
              "Assign owners and track progress clearly",
              "Start, update, and complete sprints with ease",
              "Keep planning and execution tightly aligned"
            ]
          },
          { 
            title: "Workflow Visualization & Execution", 
            icon: <BarChart />, 
            bg: "from-blue-400 to-cyan-400",
            points: [
              "Manage tasks using flexible Kanban boards",
              "Customize workflow stages to match team processes",
              "Move tasks easily across statuses",
              "Switch between Board, List, Calendar, and Timeline views",
              "Keep all views synchronized in real time"
            ]
          },
          { 
            title: "Team Collaboration & Coordination", 
            icon: <Layers />, 
            bg: "from-pink-500 to-rose-500",
            points: [
              "Collaborate through shared workspaces and comments",
              "Assign clear roles and responsibilities",
              "Track updates and changes instantly",
              "Reduce dependency on scattered communication tools",
              "Improve transparency across teams and projects"
            ]
          },
          { 
            title: "Documentation & Knowledge Management", 
            icon: <Users />, 
            bg: "from-orange-400 to-amber-400",
            points: [
              "Create structured pages with rich text editing",
              "Organize documents using parent–child hierarchies",
              "Maintain version history for every update",
              "Attach files, images, and reference materials",
              "Keep documentation linked directly to projects"
            ]
          },
          { 
            title: "Planning, Timeline & Calendar Management", 
            icon: <Shield />, 
            bg: "from-emerald-400 to-green-400",
            points: [
              "Visualize work using timelines and Gantt-style views",
              "Plan across days, weeks, months, and quarters",
              "Track sprints and milestones in a calendar view",
              "Adjust timelines easily with real-time updates",
              "Stay ahead of deadlines and dependencies"
            ]
          },
          { 
            title: "Reporting, Insights & Work Visibility", 
            icon: <Globe />, 
            bg: "from-fuchsia-500 to-purple-500",
            points: [
              "Track project health through summary dashboards",
              "View task status distribution at a glance",
              "Monitor recent activity and team progress",
              "Identify upcoming deadlines and risks early",
              "Gain clarity without manual reporting"
            ]
          },
        ].map((service, i) => (
          <TiltCard key={i} isDark={isDark} delay={i * 0.1} className="group overflow-hidden h-full">
            <div className={`absolute -top-10 -right-10 w-40 h-60 bg-gradient-to-br ${service.bg} opacity-5 rounded-full blur-2xl group-hover:opacity-12 transition-opacity duration-500`}></div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.bg} flex items-center justify-center text-white mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
              {service.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
            <ul className="opacity-60 text-sm leading-relaxed space-y-2">
              {service.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className={isDark ? "text-white font-bold" : "text-black font-bold"}><ArrowRight className="mr-2" /></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </TiltCard>
        ))}
      </div>
      
      {/* 8. FOOTER */}
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
        </section>
      </div>
    </>
  );
};

export default Services;


