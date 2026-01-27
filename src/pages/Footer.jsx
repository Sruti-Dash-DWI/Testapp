import React from "react";
import {  Linkedin, Instagram, Facebook} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-100 via-purple-100 to-purple-200">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-black mb-1">Quotient</h2>
              <p className="text-gray-700 text-xl">
                Where ideas turn into outcomes..
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-black font-bold text-lg mb-3">Address:</h3>
              <p className="text-gray-700 leading-relaxed">
                4665 Benson Park Drive
                <br />
                Oklahoma, USA
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-3">
                Contact Details:
              </h3>
              <div className="text-gray-700 space-y-1">
                <p>405-415-9245</p>
                <p>405-658-2022</p>
                <p>quotient@support.com</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-purple-900 font-semibold text-xl mb-6">
              Services
            </h3>
            <ul className="space-y-3 ">
              <li>
                <span className="text-gray-700 text-lg">• SEO</span>
              </li>
              <li>
                <span className="text-gray-700 text-lg">
                  • Content Marketing
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-lg">• Email Marketing</span>
              </li>
              <li>
                <span className="text-gray-700 text-lg">• Brand Marketing</span>
              </li>
              <li>
                <span className="text-gray-700 text-lg">
                  • Influencer Marketing
                </span>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-purple-900 font-semibold text-xl mb-6">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-700 text-lg">• SEO Optimizer</span>
              </li>
              <li>
                <span className="text-gray-700 text-lg">
                  • Content Reach Check
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-lg">
                  • Email/Ads Marketing
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-lg">
                  • Brand Identity Builder
                </span>
              </li>
              <li>
                <span className="text-gray-700 text-lg">
                  • Connect With Influencers
                </span>
              </li>
            </ul>
          </div>

          {/* Legal + Social */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-purple-900 font-semibold text-xl mb-6">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-gray-700 text-lg">• Contacts</span>
                </li>
                <li>
                  <span className="text-gray-700 text-lg">
                    • Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="text-gray-700 text-lg">
                    • Terms & Conditions
                  </span>
                </li>
              </ul>
            </div>

            {/* Social Media Icons (aligned at bottom automatically) */}
            <div className="flex justify-end space-x-3 mt-8 lg:mt-0">
              <a
                href="#"
                className="w-10 h-10 bg-purple-900 hover:bg-purple-800 rounded-full flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-purple-900 hover:bg-purple-800 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-purple-900 hover:bg-purple-800 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright section */}
      <div className="bg-purple-800 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-white text-lg">© 2025, Quotient.inc</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
