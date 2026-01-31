import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function PlansAndPricing() {
  const { isDark } = useTheme();
  const pricingRows = [
    {
      item: 'No. of per user',
      price: '$10'
    },
    {
      item: 'No. of per storage capacity (GB)',
      price: '$0.50'
    },
    {
      item: 'No. of per test cases (100)',
      price: '$2'
    }
  ];

  return (
    <div className={`p-8 ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}>
      <div className="w-full max-w-3xl mx-auto mt-8">
        <h1 className={`text-4xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
           Pricing Details
        </h1>
        
        <div className={`rounded-lg shadow-lg overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="bg-blue-600 text-white px-6 py-4 grid grid-cols-2 gap-4">
            <span className="font-semibold text-lg">Item</span>
            <span className="font-semibold text-lg">Price</span>
          </div>

          <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {pricingRows.map((row, index) => (
              <div
                key={index}
                className={`px-6 py-6 grid grid-cols-2 gap-4 items-center ${
                  index % 2 === 0 ? (isDark ? 'bg-gray-800' : 'bg-gray-50') : (isDark ? 'bg-gray-900' : 'bg-white')
                }`}
              >
                <div>
                  <p className={`text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {row.item}
                  </p>
                </div>
                <div>
                  <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {row.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          All plans include access to all features and 24/7 support
        </p>
      </div>
    </div>
  );
}