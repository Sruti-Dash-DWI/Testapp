import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sun, Moon, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Features from "../components/Billing/Features";
import PlansAndPricing from "../components/Billing/Plans&Pricing";
import { useTheme } from '../context/ThemeContext';

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

export default function CostCalculator() {
  const { isDark, toggleTheme } = useTheme();
  const [country, setCountry] = useState('India');
  const [utilityMessages, setUtilityMessages] = useState(5);
  const [maxUtilityMessages, setMaxUtilityMessages] = useState(5);
  const [marketingMessages, setMarketingMessages] = useState(10);
  const [testCases, setTestCases] = useState(500);
  const [utilityExpanded, setUtilityExpanded] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);
  // console.log("isSubmitting =", isSubmitting);
  

  // Handle user change - suggest storage but user controls test cases manually
  const handleUserChange = (users) => {
    setUtilityMessages(users);
    
    // Update max only if users increased
    if (users > maxUtilityMessages) {
      setMaxUtilityMessages(users);
    }
    
    // Calculate suggested storage value based on users
    if (users <= 5) {
      // Free tier: suggest 10GB
      setMarketingMessages(10);
    } else {
      // Paid tier: +2GB per user above 5
      const extraUsers = users - 5;
      const suggestedStorage = 10 + (extraUsers * 2);
      
      // Auto-update storage to suggested value (user can manually change later)
      setMarketingMessages(suggestedStorage);
    }
  };
  
  const calculateMonthlyCost = () => {
    // Calculate based on all three parameters
    const userCost = utilityMessages > 5 ? (utilityMessages - 5) * 10 : 0;
    const storageCost = marketingMessages > 10 ? (marketingMessages - 10) * 0.5 : 0;
    const testCaseCost = testCases > 500 ? ((testCases - 500) / 100) * 2 : 0;
    
    const total = userCost + storageCost + testCaseCost;
    return total.toFixed(2);
  };

  const calculateYearlyCost = () => {
    const monthlyCost = parseFloat(calculateMonthlyCost());
    const yearlyCost = monthlyCost * 12 * 0.98;
    return yearlyCost.toFixed(2);
  };

  const totalCost = billingPeriod === 'monthly' ? calculateMonthlyCost() : calculateYearlyCost();
  
  const currencySymbol = country === 'India' ? '₹' : '$';

  const handleReset = () => {
    setUtilityMessages(5);
    setMaxUtilityMessages(5);
    setMarketingMessages(10);
    setTestCases(500);
    setApiResponse(null);
    setApiError(null);
  };

 const handleActivateSubscription = async () => {
 
  setIsSubmitting(true);
  setApiError(null);
  setApiResponse(null);

  const token = localStorage.getItem('authToken');
  


  if (!token) {
   

    setApiError('Please login first');
    setIsSubmitting(false);
    return;
  }

  try {
    
    const response = await fetch(
    `${API_BASE_URL}/billing/subscriptions/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          billing_cycle: 'FREE_TRIAL',
          selected_users: 5,
          selected_storage_gb: 10,
          selected_testcases: 500,
        }),
      }
    );
    

    const data = await response.json();
    

    if (response.ok) {
      
      setApiResponse(data);
      alert('Subscription activated successfully!');
    } else {
       
      setApiError(
        data.non_field_errors?.[0] ||
        data.detail ||
        'Activation failed'
      );
    }
  } catch (err) {
    
    setApiError('Network error: ' + err.message);
  } finally {
    setIsSubmitting(false);
    console.log("isSubmitting AFTER = false");
  }
};


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
        <div className="pt-30 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Estimate your Qora-AI costs
              </h1>
              <p className={`max-w-4xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Use this calculator to estimate your monthly costs for sending WhatsApp messages via Qora-AI.
              </p>
            </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                How Meta's template fees and categories work
              </h2>
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                The Meta per-template message fee varies by use case: utility, authentication, or marketing. You are charged for each template message you send.
              </p>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                During a customer service window, Meta does not charge for utility template messages or free-form messages.
              </p>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                A customer service window lasts for 24 hours after you receive a customer-initiated WhatsApp message. You will still be charged for Marketing and authentication templates.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Utility Template</h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Specific customer requests, transactions, post-purchase notifications, or billing reminders.
                  </p>
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Free-form messages</h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Messages that don't use a template. These are only allowed during a customer service window.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`rounded-lg shadow-sm border p-6 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="mb-6">
                <div className={`flex gap-2 p-1 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                      billingPeriod === 'monthly'
                        ? 'bg-blue-600 text-white shadow-md'
                        : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('yearly')}
                    className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                      billingPeriod === 'yearly'
                        ? 'bg-blue-600 text-white shadow-md'
                        : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                </select>
              </div>

              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-900 mb-2">
                  Estimated {billingPeriod} total
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {currencySymbol}{totalCost}
                </div>
                {billingPeriod === 'yearly' && (
                  <div className="text-sm text-green-600 font-medium mb-2">
                    Save 2% with yearly billing
                  </div>
                )}
                
                {apiError && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                    {apiError}
                  </div>
                )}
                
                {apiResponse && (
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">
                    ✓ Subscription activated! ID: {apiResponse.id}
                  </div>
                )}

                <div className="flex gap-2 mb-2">
                  <button
                    onClick={()=>{console.log("🔥 Button clicked");
                          handleActivateSubscription();

                    }}

                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                  >
                    {isSubmitting ? 'Activating...' : 'Activate Subscription'}
                   
                  </button>
                </div>
                
                <button
                  onClick={handleReset}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Reset calculator
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <button
                  onClick={() => setUtilityExpanded(!utilityExpanded)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    Utility Template
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {currencySymbol}{totalCost}
                    </span>
                    {utilityExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {utilityExpanded && (
                  <div className="space-y-4">
                    <div className={`flex items-start gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="text-lg">ⓘ</span>
                      <span>
                        Free trial: Up to 5 users, 10GB storage, 500 test cases
                      </span>
                    </div>
                    <div className={`flex items-start gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="text-lg">ⓘ</span>
                      <span>Pricing: {currencySymbol}10/user (above 5) + {currencySymbol}0.50/GB (above 10GB) + {currencySymbol}2 per 100 test cases (above 500)</span>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Number of users: {utilityMessages}
                        {utilityMessages <= 5 && <span className="text-green-600 ml-2">(Free Trial)</span>}
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="80000"
                        step="1"
                        value={utilityMessages}
                        onChange={(e) => {
                          const newValue = Number(e.target.value);
                          if (newValue >= maxUtilityMessages) {
                            handleUserChange(newValue);
                          }
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5 (Min: {maxUtilityMessages})</span>
                        <span>80,000+</span>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Storage capacity: {marketingMessages} GB
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="80000"
                        value={marketingMessages}
                        onChange={(e) => setMarketingMessages(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10 GB</span>
                        <span>80,000+ GB</span>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Number of test cases: {testCases}
                      </label>
                      <input
                        type="range"
                        min="500"
                        max="80000"
                        value={testCases}
                        onChange={(e) => setTestCases(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>500</span>
                        <span>80,000+</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Features />
      <PlansAndPricing />
        </div>
      </div>
    </>
  );
}



