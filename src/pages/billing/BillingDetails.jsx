import React, { useState } from 'react';
import { Users, Database, Edit, Shield, Lock, CreditCard } from 'lucide-react';

export default function SubscriptionCheckout() {
  const [redeemCode, setRedeemCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [refundAccepted, setRefundAccepted] = useState(false);

  const handleApplyCode = () => {
    console.log('Applying code:', redeemCode);
  };

  const handleCompletePurchase = () => {
    console.log('Purchase completed');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Subscription
          </h1>
          <p className="text-gray-600">
            Review your plan details and finalize your payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Subscription Overview */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Subscription Overview
              </h2>
             
            </div>

            <p className="text-gray-500 text-m mb-4">Monthly billing cycle</p>
            <hr className="mb-8 border-gray-300" />

            {/* Team Members - with background */}
            <div className="bg-gray-50 rounded-xl p-5 mb-5">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-lg p-3 mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Team Members</h3>
                  <p className="text-m text-gray-500">Active users included in your plan</p>
                </div>
                <div className="text-2xl font-bold text-gray-900">10</div>
              </div>
            </div>

            {/* Storage Capacity - with background */}
            <div className="bg-gray-50 rounded-xl p-5 mb-5">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-lg p-3 mr-4">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Storage Capacity</h3>
                  <p className="text-m text-gray-500">Cloud storage for test data and assets</p>
                </div>
                <div className="text-2xl font-bold text-gray-900">20GB</div>
              </div>
            </div>

            {/* Test Cases - with background */}
            <div className="bg-gray-50 rounded-xl p-5 mb-2">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-lg p-3 mr-4">
                  <Edit className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Test Cases</h3>
                  <p className="text-m text-gray-500">Maximum test cases per month</p>
                </div>
                <div className="text-2xl font-bold text-gray-900">100</div>
              </div>
            </div>
            <hr className="mt-7 border-gray-300" />

            {/* Security Badge */}
            <div className="flex items-center text-m text-gray-600 mt-8">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Protected by enterprise-grade security
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Payment Summary
            </h2>

            {/* Plan Details */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900"> Monthly subscription</h3>
                </div>
                <span className="text-xl font-semibold text-gray-900">$55.00</span>
              </div>
              <hr className="mt-4 border-gray-300" />
            </div>

            {/* Redeem Code - with background */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Redeem Code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
                <button
                  onClick={handleApplyCode}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">$55.00</span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="text-gray-600">Tax (0%)</span>
                <span className="text-gray-900 font-medium">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">$55.00</span>
              </div>
            </div>

            {/* Checkboxes - with background */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <div className="space-y-3">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-m text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  </span>
                </label>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-m text-gray-700">
                    I acknowledge the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refundAccepted}
                    onChange={(e) => setRefundAccepted(e.target.checked)}
                    className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-m text-gray-700">
                    I accept the <a href="#" className="text-blue-600 hover:underline">Refund Policy</a>
                  </span>
                </label>
              </div>
            </div>

            {/* Complete Purchase Button */}
            <button
              onClick={handleCompletePurchase}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center mb-4"
            >
              <Lock className="w-5 h-5 mr-2" />
              Complete Purchase
            </button>

            {/* Security Info */}
            <div className="flex items-center justify-center text-xs text-gray-500 gap-4">
              <div className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Secure Payment
              </div>
              <span>•</span>
              <div className="flex items-center">
                <CreditCard className="w-3 h-3 mr-1" />
                256-bit Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}