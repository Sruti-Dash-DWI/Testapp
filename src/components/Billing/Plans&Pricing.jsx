import React from 'react';

export default function PlansAndPricing() {
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
    <div className="bg-gray-50 p-8">
      <div className="w-full max-w-3xl mx-auto mt-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
           Pricing Details
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4 grid grid-cols-2 gap-4">
            <span className="font-semibold text-lg">Item</span>
            <span className="font-semibold text-lg">Price</span>
          </div>

          <div className="divide-y divide-gray-200">
            {pricingRows.map((row, index) => (
              <div
                key={index}
                className={`px-6 py-6 grid grid-cols-2 gap-4 items-center ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div>
                  <p className="text-gray-900 text-base">
                    {row.item}
                  </p>
                </div>
                <div>
                  <p className="text-gray-900 text-lg font-semibold">
                    {row.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          All plans include access to all features and 24/7 support
        </p>
      </div>
    </div>
  );
}