import React from "react";
import { SectionHeader, TiltCard, ScrollReveal } from "./Landing";
import { Linkedin, Instagram, Facebook, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = ({ isDark }) => {
  return (
    <section className={`py-15 px-6 relative z-10 ${isDark ? 'bg-black/20' : 'bg-white/20'}`}>
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
            {/* <h3 className={`text-4xl font-bold mb-8 leading-tight ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>
              Reimagining the <br /> Future of Work.
            </h3> */}
            <p className="text-lg opacity-70 leading-relaxed mb-6">
              QORA-AI provides a structured work management platform designed to help teams plan, track, and manage work throughout its lifecycle. The platform offers a visual workflow that enables clear task ownership, well-defined state transitions, and real-time progress visibility.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-20 items-center mb-24">
          <ScrollReveal>
            {/* <h3 className={`text-4xl font-bold mb-8 leading-tight ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>
              Reimagining the <br /> Future of Work.
            </h3> */}
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
  );
};

export default AboutUs;
