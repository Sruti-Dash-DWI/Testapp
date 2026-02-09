
import React, { useEffect, useState } from "react";
import { Calendar, Users, Database, FileText, Clock, TrendingUp } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyCurrentPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/billing/subscriptions/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscription");
        }

        const data = await response.json();
        const activePlan = Array.isArray(data)
          ? data.find((item) => item.is_active) || data[0]
          : data;

        setPlan(activePlan);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlan();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your current plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Plan</h3>
          <p className="text-gray-600 mb-6">You don't have an active subscription yet.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors">
            Explore Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Current Plan
          </h1>
          <p className="text-gray-600">
            Manage and review your subscription details
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Plan Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {plan.formatted_status || "Free Trial"}
                </h2>
                <p className="text-blue-100">Active Subscription</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">
                  {plan.billing_cycle?.toUpperCase() || "MONTHLY"}
                </span>
              </div>
            </div>
          </div>

          {/* Plan Details Grid */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Users */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-lg p-3 mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Users Included</h3>
                    <p className="text-sm text-gray-500">Active team members</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {plan.selected_users || "5"}
                  </div>
                </div>
              </div>

              {/* Storage */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-lg p-3 mr-4">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Storage</h3>
                    <p className="text-sm text-gray-500">Cloud storage space</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {plan.selected_storage_gb || "10"} GB
                  </div>
                </div>
              </div>

              {/* Test Cases */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-lg p-3 mr-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Test Cases</h3>
                    <p className="text-sm text-gray-500">Monthly test limit</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {plan.selected_testcases || "500"}
                  </div>
                </div>
              </div>

              {/* Billing Cycle */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-lg p-3 mr-4">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Billing Cycle</h3>
                    <p className="text-sm text-gray-500">Payment frequency</p>
                  </div>
                  <div className="text-xl font-bold text-gray-900 capitalize">
                    {plan.billing_cycle || "Monthly"}
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Period */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Subscription Period
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Start Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(plan.start_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(plan.end_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Upgrade Section */}
            <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">
                      Want more features?
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Upgrade your plan to unlock advanced features and increase your limits
                  </p>
                </div>
                <button className="ml-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Need help? Contact our{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
