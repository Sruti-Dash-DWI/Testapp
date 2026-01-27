import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { SectionHeader, TiltCard } from "./Landing";

const SeeDemo = ({ isDark = false }) => {
  return (
    <section className="py-20 px-6 relative z-10">
      <SectionHeader title="See Qora-AI in Action" subtitle="Take a guided walkthrough of the Qora-AI dashboard and explore how teams plan, track, collaborate, and deliver work—all in one workspace." isDark={isDark} />
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
  );
};

export default SeeDemo;