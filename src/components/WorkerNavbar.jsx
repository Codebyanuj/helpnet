import React, { useState } from 'react';

const WorkerNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-green-900 to-black shadow-lg p-4 mx-3 mt-3 border-2 border-gray-700 rounded-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <div className="bg-yellow-500 p-2 rounded-full">
            <span className="text-white text-2xl font-extrabold font-mono">W</span>
          </div>
          <span className="text-white text-2xl font-extrabold font-mono">WorkNet</span>
        </div>
        <div className="hidden md:flex space-x-12 text-lg font-serif">
          <a href="/" className="text-white hover:text-yellow-400 transition duration-300">Home</a>
          <a href="/jobs" className="text-white hover:text-yellow-400 transition duration-300">My Jobs</a>
          <a href="/profile" className="text-white hover:text-yellow-400 transition duration-300">Profile</a>
          <a href="/support" className="text-white hover:text-yellow-400 transition duration-300">Support</a>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search Jobs..."
            className="hidden md:block p-2 rounded-full text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div className="hidden md:flex space-x-4">
            <button
              type="button"
              className="text-white bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 font-semibold rounded-full text-sm px-7 py-2 text-center"
            >
              <a href="/signin">SignIn</a>
            </button>

            <button
              type="button"
              className="text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-full text-sm px-7 py-2 text-center"
            >
              <a href="/login">Login</a>
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-white focus:outline-none"
              aria-label="Toggle navigation"
              onClick={toggleMobileMenu}
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

      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 text-center mt-4">
          <a href="/" className="text-white hover:text-yellow-400 transition duration-300">Home</a>
          <a href="/jobs" className="text-white hover:text-yellow-400 transition duration-300">My Jobs</a>
          <a href="/profile" className="text-white hover:text-yellow-400 transition duration-300">Profile</a>
          <a href="/support" className="text-white hover:text-yellow-400 transition duration-300">Support</a>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="text-white bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 font-semibold rounded-full text-sm px-7 py-2 text-center"
            >
              <a href="/signin">SignIn</a>
            </button>

            <button
              type="button"
              className="text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-full text-sm px-7 py-2 text-center"
            >
              <a href="/login">Login</a>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default WorkerNavbar;
