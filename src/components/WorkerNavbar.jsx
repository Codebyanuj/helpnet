import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Ensure your Firebase configuration is correct
import userIcon from '../components/Icons/user1.png';
import { onAuthStateChanged } from 'firebase/auth'; // Import Auth function

const WorkerNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if a user is logged in and fetch their profile data
    const fetchWorkerProfile = async (userId) => {
      setLoading(true);
      setError(null);

      try {
        const workerRef = doc(db, 'Workers', userId);
        const workerDoc = await getDoc(workerRef);

        if (workerDoc.exists()) {
          setWorker(workerDoc.data());
        } else {
          setError('Worker not found');
        }
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    };

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch profile if a user is logged in
        fetchWorkerProfile(user.uid); // Assuming the worker ID is the same as the user UID
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="bg-lime-900 shadow-lg p-4 mx-3 mt-3 border-2 border-gray-700 rounded-xl relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <div className="bg-red-500 p-2 rounded-full">
            <span className="text-white text-2xl font-extrabold font-mono">H</span>
          </div>
          <span className="text-white text-2xl font-extrabold font-mono">HelpNet</span>
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
          <div className="flex items-center space-x-2">
            <div className="text-white cursor-pointer" onClick={toggleSidebar}>
              <img className="w-10 h-10 text-white bg-white rounded-full" src={userIcon} alt="User Icon" />
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

      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}></div>
          <div className="fixed inset-y-13 right-0 bg-white w-80 p-6 z-50 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">{worker.name}</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : worker ? (
              <>
                <p className="text-gray-600">Name: {worker.name}</p>
                <p className="text-gray-600">Email: {worker.email}</p>
                <p className="text-gray-600">Phone: {worker.phone}</p>
                <p className="text-gray-600">Type of Work: {worker.typeOfWork}</p>
                <p className="text-gray-600">Experience: {worker.experience}</p>
                {/* Add more fields as necessary */}
              </>
            ) : (
              <p>No worker data available.</p>
            )}
            <button
              type="button"
              className="mt-4 text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-full text-sm px-7 py-2 text-center"
              onClick={toggleSidebar}
            >
              Close
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default WorkerNavbar;
