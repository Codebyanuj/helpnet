import React, { useState } from 'react';

const Navbar = () => {
  // State to manage the visibility of the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-950 to-black shadow-lg p-4 mx-3 mt-3 border-2 border-gray-700 rounded-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <div className="bg-cyan-500 p-2 rounded-full">
            <span className="text-white text-2xl font-extrabold font-mono">H</span>
          </div>
          <span className="text-white text-2xl font-extrabold font-mono">Helpnet</span>
        </div>

        {/* Navigation links */}
        <div className="hidden md:flex space-x-12 text-lg font-serif">
          <a href="/" className="text-white hover:text-cyan-400 transition duration-300">Home</a>
          <a href="/Aboutus" className="text-white hover:text-cyan-400 transition duration-300">About</a>
          <a href="/Container" className="text-white hover:text-cyan-400 transition duration-300">Categories</a>
          <a href="/Help" className="text-white hover:text-cyan-400 transition duration-300">Help</a>
        </div>

        {/* Right-aligned buttons and Hamburger Menu */}
        <div className="flex items-center space-x-4">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search..."
            className="hidden md:block p-2 rounded-full text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* SignIn and Login buttons on large screens */}
          <div className="hidden md:flex space-x-4"> {/* Buttons are shown only on medium and larger screens */}
            <button
              type="button"
              className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
            >
              <a href="SignType">SignIn</a>
            </button>

            <button
              type="button"
              className="text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
            >
              <a href="login">Login</a>
            </button>
          </div>




           {/* Code for the responsiveness of the Hamburger on the smaller screen */}
          {/* Hamburger Menu on small screens */}
          <div className="md:hidden flex items-center"> {/* Hamburger menu is shown only on small screens */}
            <button
              type="button"
              className="text-white focus:outline-none"
              aria-label="Toggle navigation"
              onClick={toggleMobileMenu} // Toggle the menu on click
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      {isMobileMenuOpen && ( // Show the links only if the menu is open
        <div className="md:hidden flex flex-col space-y-4 text-center mt-4">
          <a href="/" className="text-white hover:text-cyan-400 transition duration-300">Home</a>
          <a href="/about" className="text-white hover:text-cyan-400 transition duration-300">About</a>
          <a href="/Container" className="text-white hover:text-cyan-400 transition duration-300">Categories</a>
          <a href="/help" className="text-white hover:text-cyan-400 transition duration-300">Help</a>

          {/* Mobile Right-aligned buttons */}
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
            >
              <a href="SignType">SignIn</a>
            </button>

            <button
              type="button"
              className="text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
            >
              <a href="login">Login</a>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
