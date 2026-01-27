import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactModal = ({ isOpen, onClose }) => {
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
                onClose();
                window.location.reload(); // This will refresh the page
            }}
            className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
            Okay, Got It
        </button>
      </div>
    </motion.div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
        {isSuccess ? (
          <div onClick={e => e.stopPropagation()}>
            <SuccessPopup />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
                <p className="mt-2 text-gray-600">
                  Have a question or need help? Our team will get back to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`block w-full px-4 py-2 rounded-lg border ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your work email"
                      className={`block w-full px-4 py-2 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Enter your company name"
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700">
                      Team Size
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-500"
                    >
                      <option value="">Select your team size</option>
                      <option value="1-10">1–10</option>
                      <option value="11-50">11–50</option>
                      <option value="51-200">51–200</option>
                      <option value="200+">200+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    className={`block w-full px-4 py-2 rounded-lg border ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your question or requirement"
                    className={`block w-full px-4 py-2 rounded-lg border ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
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
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;