import React, { useState } from "react";
import { Cpu, BarChart, Layers, Users, Shield, Globe,ArrowRight, Linkedin, Instagram, Facebook } from "lucide-react";
import { SectionHeader, TiltCard, ScrollReveal } from "./Landing";
import { Link } from "react-router-dom";

const Services = () => {
  const [isDark] = useState(false); // You can manage dark mode here if needed

  return (
    <section className="py-15 px-6 relative z-10">
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
                  <span className="text-black font-bold"><ArrowRight className="mr-2" /></span>
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
          <div className="max-w-7xl mt-5 mx-auto grid md:grid-cols-4 gap-12">
            <div>
              <h2 className="text-2xl font-black mb-6 tracking-tighter">QORA-AI</h2>
              <p className="opacity-60 text-sm leading-relaxed">Where ideas turn into achievements</p>
            </div>
            <div>
              <h4 className={`font-bold mb-6 text-sm uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>Services</h4>
              <ul className="space-y-3 opacity-60 text-sm">
                <li className="hover:opacity-100 cursor-pointer transition-opacity">SEO Optimization</li>
                <li className="hover:opacity-100 cursor-pointer transition-opacity">Content Marketing</li>
                <li className="hover:opacity-100 cursor-pointer transition-opacity">Email Campaigns</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-6 text-sm uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>Products</h4>
              <ul className="space-y-3 opacity-60 text-sm">
                <li className="hover:opacity-100 cursor-pointer transition-opacity">SEO Generator</li>
                <li className="hover:opacity-100 cursor-pointer transition-opacity">Content Basel-Checker</li>
                <li className="hover:opacity-100 cursor-pointer transition-opacity">Email Automation</li>
              </ul>
            </div>
            <div className="flex justify-end space-x-3 mt-8 lg:mt-22">
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          <div className="text-center mt-12 font-bold pt-8 border-t border-current border-opacity-10 opacity-40 text-xs">
            &copy; 2025 QORA-AI. All rights reserved.
          </div>
        </ScrollReveal>
      </footer>
    </section>
  );
};

export default Services;


