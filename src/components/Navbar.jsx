import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, ChevronDown, Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Handler for smooth scrolling to sections
  const handleScroll = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.history.pushState(null, '', `/#${sectionId}`);
    setMenuOpen(false); // Close mobile menu after clicking a link
  };

  const linkClassName = "text-xl font-medium text-purple-700 hover:text-purple-500 transition-colors";

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-100 via-purple-200 to-white shadow-md">
      
      {/* Logo and Brand Name */}
      <NavLink to="/#home" onClick={(e) => handleScroll(e, 'home')} className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
          <span className="text-2xl font-bold text-white">Q</span>
        </div>
        <span className="text-2xl font-bold text-gray-900">Quotient</span>
      </NavLink>

      {/* Desktop Navigation Links */}
      <div className="hidden items-center space-x-15 md:flex">
        <NavLink to="/#home" onClick={(e) => handleScroll(e, 'home')} className={linkClassName}>Home</NavLink>
        <NavLink to="/#about" onClick={(e) => handleScroll(e, 'about')} className={linkClassName}>About</NavLink>
        <NavLink to="/#services" onClick={(e) => handleScroll(e, 'services')} className={linkClassName}>Services</NavLink>
        <NavLink to="/#facilities" onClick={(e) => handleScroll(e, 'facilities')} className={linkClassName}>Facilities</NavLink>
        
        {/* Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`${linkClassName} flex items-center space-x-1`}
          >
            <span>More</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full mt-2 w-48 rounded-lg bg-white py-2 shadow-xl">
              <Link to="/blog" className="block px-4 py-2 text-gray-800 hover:bg-purple-50" onClick={() => setDropdownOpen(false)}>Blog</Link>
              <Link to="/careers" className="block px-4 py-2 text-gray-800 hover:bg-purple-50" onClick={() => setDropdownOpen(false)}>Careers</Link>
              <Link to="/contact" className="block px-4 py-2 text-gray-800 hover:bg-purple-50" onClick={() => setDropdownOpen(false)}>Contact Us</Link>
            </div>
          )}
        </div>
      </div>

      {/* Auth Buttons & Mobile Menu Toggle */}
      <div className="flex items-center space-x-4">
        <Search className="hidden h-6 w-6 cursor-pointer text-purple-700 transition-colors hover:text-purple-500 md:block" />
        
        {/* Desktop Auth Buttons */}
        <>
          <Link to="/login">
            <button className="hidden px-4 py-2 text-lg font-semibold text-purple-700 transition-colors hover:text-purple-500 md:block">
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="hidden rounded-full bg-purple-600 px-6 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-purple-700 md:block">
              Sign up
            </button>
          </Link>
        </>
        
        {/* Mobile Menu Button */}
        <button className="text-purple-600 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="absolute left-0 top-full flex w-full flex-col space-y-4 rounded-b-2xl bg-white px-6 py-6 shadow-lg md:hidden">
          <NavLink to="/#home" onClick={(e) => handleScroll(e, 'home')} className="font-medium text-purple-500">Home</NavLink>
          <NavLink to="/#about" onClick={(e) => handleScroll(e, 'about')} className="font-medium text-purple-500">About</NavLink>
          <NavLink to="/#services" onClick={(e) => handleScroll(e, 'services')} className="font-medium text-purple-500">Services</NavLink>
          <NavLink to="/#facilities" onClick={(e) => handleScroll(e, 'facilities')} className="font-medium text-purple-500">Facilities</NavLink>
          
          {/* Mobile Auth Buttons */}
          <div className="mt-4 border-t border-purple-200 pt-4">
            <div className="flex flex-col space-y-2">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="w-full py-2 font-semibold text-purple-700">
                  Sign In
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <button className="w-full rounded-full bg-purple-600 py-2 font-semibold text-white">
                  Sign up
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;