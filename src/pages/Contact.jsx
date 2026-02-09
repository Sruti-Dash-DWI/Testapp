import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, ArrowRight, Facebook, Instagram, Sun, Moon, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeader, TiltCard, ScrollReveal } from "./Landing";
import SubscriptionModal from '../components/SubscriptionModal';
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

const Contact = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    teamSize: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName) errors.fullName = 'Full Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.subject) errors.subject = 'Subject is required';
    if (!formData.message) errors.message = 'Message is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1500);
    } else {
      setErrors(validationErrors);
    }
  };

  // Success Popup Component
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
          onClick={() => {
            window.scrollTo(0, 0);
            window.location.reload();
          }}
          className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          Okay, Got It
        </button>
      </div>
    </motion.div>
  );

  // Add state for sticky contact card
  const [isSticky, setIsSticky] = useState(false);
  const [contactCardHeight, setContactCardHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const contactCardRef = React.useRef(null);
  const contentRef = React.useRef(null);

  // Set up scroll effect for sticky contact card
  useEffect(() => {
    const handleScroll = () => {
      if (contactCardRef.current && contentRef.current) {
        const contactRect = contactCardRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();
        const scrollPosition = window.scrollY + 100; // Add some offset
        
        // Calculate when to make the contact card sticky
        const shouldBeSticky = scrollPosition > contentRect.top && 
        scrollPosition < (contentRect.bottom - contactRect.height);
        
        setIsSticky(shouldBeSticky);
      }
    };

    // Set initial heights
    if (contactCardRef.current && contentRef.current) {
      setContactCardHeight(contactCardRef.current.offsetHeight);
      setContentHeight(contentRef.current.offsetHeight);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <img src="QORA_AI Logo.svg" alt="Qora AI" className="w-45 h-auto" />
          </div>
          <div className="hidden md:flex gap-18 font-bold text-sm tracking-widest uppercase opacity-70">
            <a href="/" className="hover:text-blue-600 transition-colors relative group py-2">Home</a>            
            <a href="/About" className="hover:text-blue-600 transition-colors relative group py-2">About us</a>
            <a href="/Services" className="hover:text-blue-600 transition-colors relative group py-2">Services</a>
            <a href="/contact" className="hover:text-blue-600 transition-colors relative group py-2">Contact</a>
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
           
  <div className={`min-h-screen pt-30 py-15 px-6 sm:px-6 lg:px-8
    ${isDark ? 'bg-[#050505]' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
    <div className="max-w-6xl mx-auto">
      {isSuccess ? (
        <SuccessPopup />
      ) : (
        <>
          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Get In Touch</h1>
              <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Have questions, need support, or want to learn more about Qora-AI?
              </p>
              <p className={isDark ? 'text-gray-400 mt-2' : 'text-gray-500 mt-2'}>
                Fill out the form below and our team will get back to you shortly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
              {/* Left Content */}
              <div className="lg:sticky lg:top-10 self-start"> 
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl shadow-xl p-8 sm:p-10 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
              >
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Location</h3>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>123 Tech Park, Silicon Valley, CA 94025</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Phone Number</h3>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Email Address</h3>
                        <p className="text-blue-600">contact@qora-ai.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Follow Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className={`${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-600 transition-colors`}>
                        <Facebook size={24} />
                      </a>
                      <a href="#" className={`${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-600 transition-colors`}>
                        <Instagram size={24} />
                      </a>
                      <a href="#" className={`${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-600 transition-colors`}>
                        <Linkedin size={24} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Contact Form */}
              <div 
                ref={contactCardRef}
                className={`lg:sticky ${isSticky ? 'lg:top-8' : 'lg:top-8'}`}
              >
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Get In Touch</h3>
                      <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Fill out the form below and our team will get back to you shortly.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label htmlFor="fullName" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`block w-full px-4 py-2 rounded-lg border ${errors.fullName ? 'border-red-500' : (isDark ? 'border-gray-600' : 'border-gray-300')
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                      />
                      {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Work Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : (isDark ? 'border-gray-600' : 'border-gray-300')
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="company" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`block w-full px-4 py-2 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="teamSize" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Team Size
                      </label>
                      <select
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleChange}
                        className={`block w-full px-4 py-2 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                      >
                        <option value="">Select your team size</option>
                        <option value="1-10">1–10</option>
                        <option value="11-50">11–50</option>
                        <option value="51-200">51–200</option>
                        <option value="200+">200+</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`block w-full px-4 py-2 rounded-lg border ${errors.subject ? 'border-red-500' : (isDark ? 'border-gray-600' : 'border-gray-300')
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                      />
                      {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        className={`block w-full px-4 py-2 rounded-lg border ${errors.message ? 'border-red-500' : (isDark ? 'border-gray-600' : 'border-gray-300')
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                      ></textarea>
                      {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                    </div>

                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </div>
                        ) : (
                          'Send Message'
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            

            {/* 7. FAQ's */}
            <section className={`py-25 px-6 relative z-10 ${isDark ? 'bg-black/10' : 'bg-transparent'}`}>
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
            </section>
          </>
        )}
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
    </div>
    </div>
    </>

  );
};

export default Contact;
