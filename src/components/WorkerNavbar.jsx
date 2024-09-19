import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Ensure your Firebase configuration is correct
import userIcon from '../components/Icons/user1.png';
import { onAuthStateChanged } from 'firebase/auth'; // Import Auth function

const WorkerNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [charges, setCharges] = useState('');
  const [workingDays, setWorkingDays] = useState([]);
  const [success, setSuccess] = useState('');
  const [showCode, setshowCode] = useState(false);

  useEffect(() => {
    const fetchWorkerProfile = async (userId) => {
      setLoading(true);
      setError(null);

      try {
        const workerRef = doc(db, 'Workers', userId);
        const workerDoc = await getDoc(workerRef);

        if (workerDoc.exists()) {
          setWorker(workerDoc.data());
          setCharges(workerDoc.data().charges || ''); // Set initial charges
          setWorkingDays(workerDoc.data().workingDays || ''); // Set initial working days
        } else {
          setError('Worker not found');
        }
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
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

  const toggleVisibility = () => {
    setshowCode(!showCode);
  };

  const handleWorkingDaysChange = (event) => {
    setWorkingDays([...event.target.selectedOptions].map(option => option.value));
  };

  const updateWorkerData = async () => {
    if (worker) {
      try {
        await setDoc(doc(db, 'Workers', auth.currentUser.uid), {
          ...worker,
          charges: charges,
          workingDays: workingDays,
        }, { merge: true });
        setSuccess('Data updated successfully');
      } catch (err) {
        setError('Error updating data: ' + err.message);
      }
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 to-green-900 shadow-lg p-4 mx-3 mt-3 border-2 border-gray-700 rounded-xl relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-full">
            <span className="text-white text-2xl font-extrabold font-mono">H</span>
          </div>
          <span className="text-white text-2xl font-extrabold font-mono">HelpNet</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-12 text-lg font-serif">
          <a href="/" className="text-white hover:text-yellow-400 transition duration-300">Home</a>
          <a href="/jobs" className="text-white hover:text-yellow-400 transition duration-300">My Jobs</a>
          <a href="/profile" className="text-white hover:text-yellow-400 transition duration-300">Profile</a>
          <a href="/support" className="text-white hover:text-yellow-400 transition duration-300">Support</a>
        </div>

        {/* Mobile Search Bar */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search Jobs..."
            className="hidden md:block p-2 rounded-full text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <button className="text-white bg-yellow-500 hover:bg-yellow-600 rounded-full text-sm px-6 py-2">
              <a href="/signin">SignIn</a>
            </button>
            <button className="text-white bg-green-600 hover:bg-green-700 rounded-full text-sm px-6 py-2">
              <a href="/login">Login</a>
            </button>
          </div>

          {/* Sidebar Icon */}
          <div className="flex items-center space-x-2">
            <div className="text-white cursor-pointer" onClick={toggleSidebar}>
              <img className="w-10 h-10 rounded-full" src={userIcon} alt="User Icon" />
            </div>

            {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 text-center mt-4">
          <a href="/" className="text-white hover:text-yellow-400 transition duration-300">Home</a>
          <a href="/jobs" className="text-white hover:text-yellow-400 transition duration-300">My Jobs</a>
          <a href="/profile" className="text-white hover:text-yellow-400 transition duration-300">Profile</a>
          <a href="/support" className="text-white hover:text-yellow-400 transition duration-300">Support</a>
          <div className="flex justify-center space-x-4">
            <button className="text-white bg-yellow-500 hover:bg-yellow-600 rounded-full text-sm px-6 py-2">
              <a href="/signin">SignIn</a>
            </button>
            <button className="text-white bg-green-600 hover:bg-green-700 rounded-full text-sm px-6 py-2">
              <a href="/login">Login</a>
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}></div>
          <div className="fixed inset-y-13 right-0 bg-white w-80 p-6 z-50 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Edit Worker Profile</h2>
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

                {/* Toggle Edit Form */}
                <button
                  className="bg-lime-400 text-black p-1 rounded-full w-full mt-2 hover:bg-yellow-300"
                  onClick={toggleVisibility}
                >
                  {showCode ? 'Hide' : 'Edit'}
                </button>

                {/* Editable Form */}
                {showCode && (
                  <div>
                    <div className="mb-4">
                      <label htmlFor="charges" className="block text-gray-700 text-sm font-bold mb-2">Charges:</label>
                      <input
                        type="text"
                        id="charges"
                        value={charges}
                        onChange={(e) => setCharges(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter charges"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="workingDays" className="block text-gray-700 text-sm font-bold mb-2">Working Days:</label>
                      <div className="flex flex-wrap gap-4">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <div key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              id={day}
                              value={day}
                              checked={workingDays.includes(day)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setWorkingDays([...workingDays, day]);
                                } else {
                                  setWorkingDays(workingDays.filter((d) => d !== day));
                                }
                              }}
                              className="h-4 w-4 text-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor={day} className="ml-2 text-gray-700">{day}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      className="w-full bg-lime-500 text-white rounded-lg py-2 hover:bg-lime-600 transition duration-300"
                      onClick={updateWorkerData}
                    >
                      Save
                    </button>
                    {success && <p className="text-green-500 mt-2">{success}</p>}
                  </div>
                )}
              </>
            ) : null}
            <button
              className="bg-red-600 text-white px-4 py-2 mt-4 rounded hover:bg-red-700 transition duration-300"
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
