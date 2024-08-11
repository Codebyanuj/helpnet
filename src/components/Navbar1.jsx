import React from 'react';




const Navbar = () => {
  return (
   
      <nav className="bg-white shadow-md p-2  px-3 mt-3 mx-3 border-solid border-2 border-black rounded-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-gray-800 text-xl font-extrabold font-mono">Helpnet</span>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex space-x-10 text-lg font-serif">
            <a href="/" className="text-black hover:text-amber-600">Home</a>
            <a href="/about" className="text-black hover:text-amber-600">About</a>
            <a href="/Container" className="text-black hover:text-amber-600">Categories</a>
            <a href="/help" className="text-black hover:text-amber-600">Help</a>
          </div>

          {/* Right-aligned buttons */}
          <div className="flex items-center space-x-4">

          <button type="button" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-7 py-2.5 text-center "><a href='SignType'>SignIn</a></button>


          <button type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-7 py-2.5 text-center "><a href='login'>Login</a></button>
          </div>
        </div>
      </nav>

     
   
  );
}

export default Navbar;
