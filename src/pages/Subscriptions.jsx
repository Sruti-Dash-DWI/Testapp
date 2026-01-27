import React from "react";
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import 'animate.css';
import { Check, Rocket } from 'lucide-react';

// Reusable components
const SectionHeader = ({ title, subtitle, isDark }) => (
  <div className="text-center mb-2 relative z-10 overflow-hidden">
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
      {subtitle}
    </p>
  </div>
);

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

const Subscriptions = () => {
  const [isDark, setIsDark] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingPlans = {
    monthly: [
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
    ],
    yearly: [
      {
        name: "Starter",
        price: "$290",
        period: "/yr",
        desc: "Perfect for individuals and small projects.",
        features: ["5 Projects", "Basic Analytics", "Community Support", "1GB Storage"],
        cta: "Get Started",
        popular: false
      },
      {
        name: "Professional",
        price: "$990",
        period: "/yr",
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
    ]
  };

  const currentPlans = pricingPlans[billingCycle];

  return (
    <section className={`py-15 px-6 relative z-10 ${isDark ? 'bg-black/40' : 'bg-white/40'}`}>
      <SectionHeader title="Plans & Pricing" isDark={isDark} />

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-12">
        <div className={`inline-flex p-1 rounded-full ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-10 py-2 rounded-full font-medium transition-all ${
              billingCycle === 'monthly'
                ? isDark 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-blue-600 text-white'
                : isDark 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-12 py-2 rounded-full font-medium transition-all ${
              billingCycle === 'yearly'
                ? isDark 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-blue-600 text-white'
                : isDark 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {currentPlans.map((plan, i) => (
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
                <Link to="/login">
              <button className={`w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600  active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wide
                          ${plan.popular
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : (isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200')}
                          `}>
                {plan.cta} {plan.popular && <Rocket size={14} />}
              </button>
              </Link>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default Subscriptions;