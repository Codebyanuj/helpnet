import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-950 to-black shadow-lg p-4 px-6 mx-3 mt-3 border-2 border-gray-700 rounded-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-cyan-500 p-2 rounded-full">
            <span className="text-white text-2xl font-extrabold font-mono">H</span>
          </div>
          <span className="text-white text-2xl font-extrabold font-mono">Helpnet</span>
        </div>

        {/* Navigation links */}
        <div className="hidden md:flex space-x-12 text-lg font-serif">
          <a href="/" className="text-white hover:text-cyan-400 transition duration-300">Home</a>
          <a href="/about" className="text-white hover:text-cyan-400 transition duration-300">About</a>
          <a href="/Container" className="text-white hover:text-cyan-400 transition duration-300">Categories</a>
          <a href="/help" className="text-white hover:text-cyan-400 transition duration-300">Help</a>
        </div>

        {/* Search bar */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="hidden md:block p-2 rounded-full text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Right-aligned buttons */}
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
    </nav>
  );
};

export default Navbar;
