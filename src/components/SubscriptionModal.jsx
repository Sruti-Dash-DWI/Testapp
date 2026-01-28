import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingPlans = {
    monthly: [
      { name: "Starter", price: "$29", period: "/mo", desc: "Perfect for individuals and small projects.", features: ["5 Projects", "Basic Analytics", "Community Support", "1GB Storage"], cta: "Get Started", popular: false },
      { name: "Professional", price: "$99", period: "/mo", desc: "Ideal for growing teams and startups.", features: ["Unlimited Projects", "Neural Analytics", "Priority Support", "100GB Storage", "API Access"], cta: "Try Free", popular: true },
      { name: "Enterprise", price: "Custom", period: "", desc: "For large organizations with specific needs.", features: ["Dedicated Infrastructure", "Custom AI Models", "24/7 Dedicated Support", "Unlimited Storage", "SSO & Security"], cta: "Contact Sales", popular: false }
    ],
    yearly: [
      { name: "Starter", price: "$290", period: "/yr", desc: "Perfect for individuals and small projects.", features: ["5 Projects", "Basic Analytics", "Community Support", "1GB Storage"], cta: "Get Started", popular: false },
      { name: "Professional", price: "$990", period: "/yr", desc: "Ideal for growing teams and startups.", features: ["Unlimited Projects", "Neural Analytics", "Priority Support", "100GB Storage", "API Access"], cta: "Try Free", popular: true },
      { name: "Enterprise", price: "Custom", period: "", desc: "For large organizations with specific needs.", features: ["Dedicated Infrastructure", "Custom AI Models", "24/7 Dedicated Support", "Unlimited Storage", "SSO & Security"], cta: "Contact Sales", popular: false }
    ]
  };

  const currentPlans = pricingPlans[billingCycle];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Forces modal to fill the entire screen and prevents scrolling
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white overflow-hidden h-screen w-screen"
        >
          {/* Close Button - Larger and more prominent as per your request */}
          <button
            onClick={onClose}
            className="absolute bg-gray-200 top-10 right-10 p-2 rounded-full border-1 border-black hover:bg-gray-600 hover:text-white transition-all duration-300 z-[110]"
            aria-label="Close modal"
          >
            <X size={25} />
          </button>

          <div className="w-[90%] h-full max-w-7xl mx-auto flex flex-col justify-center px-1 py-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-5xl font-black mb-2 text-black tracking-tighter">
                Plans & Pricing
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"></div>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex p-1 rounded-full bg-gray-100">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-12 py-3 rounded-full font-bold text-sm transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-12 py-3 rounded-full font-bold text-sm transition-all ${
                    billingCycle === 'yearly'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Pricing Cards Container - Fixed Height flexbox */}
            <div className="grid md:grid-cols-3 gap-6 items-stretch h-[60vh]">
              {currentPlans.map((plan, i) => (
                <div
                  key={i}
                  className={`relative p-8 rounded-[2.5rem] border-2 flex flex-col justify-between transition-all duration-300
                    ${plan.popular 
                      ? 'border-purple-500 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-105 z-10' 
                      : 'border-gray-100 bg-white hover:border-gray-300'}
                  `}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-black mb-1 text-black">{plan.name}</h3>
                    <p className="text-xs text-gray-500 mb-6">{plan.desc}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-black">{plan.price}</span>
                        <span className="text-sm text-gray-400 font-bold">{plan.period}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Check size={16} className="text-blue-500 flex-shrink-0" strokeWidth={3} />
                          <span className="text-sm font-medium text-gray-700">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to={plan.name === "Enterprise" ? "/contact" : "/signup"} className="mt-8">
                    <button className={`w-full py-4 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs
                        ${plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-black hover:bg-gray-200'}
                    `}>
                      {plan.cta} {plan.popular && <Rocket size={16} className="inline ml-2" />}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;