import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import userIcon from '../components/Icons/user1.png';
import { onAuthStateChanged } from 'firebase/auth';

const WorkerNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [charges, setCharges] = useState('');
  const [workingDays, setWorkingDays] = useState([]);
  const [success, setSuccess] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [availability, setAvailability] = useState(false);

  useEffect(() => {
    const fetchWorkerProfile = async (userId) => {
      setLoading(true);
      setError(null);

      try {
        const workerRef = doc(db, 'Workers', userId);
        const workerDoc = await getDoc(workerRef);

        if (workerDoc.exists()) {
          const workerData = workerDoc.data();
          setWorker(workerData);
          setCharges(workerData.charges || '');
          setWorkingDays(workerData.workingDays || []);
          setAvailability(workerData.availability || false);
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
        fetchWorkerProfile(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleVisibility = () => {
    setShowCode(!showCode);
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
          availability: availability,
        }, { merge: true });
        setSuccess('Data updated successfully');
      } catch (err) {
        setError('Error updating data: ' + err.message);
      }
    }
  };

  const toggleAvailability = async () => {
    const newAvailability = !availability;
    setAvailability(newAvailability);

    if (worker) {
      try {
        await setDoc(doc(db, 'Workers', auth.currentUser.uid), {
          ...worker,
          availability: newAvailability,
        }, { merge: true });
        setSuccess(`Availability set to ${newAvailability ? 'Available' : 'Busy'}`);
      } catch (err) {
        setError('Error updating availability: ' + err.message);
      }
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 to-green-900 shadow-lg p-4 mx-3 mt-3 border-2 border-gray-700 rounded-xl relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-full">
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
            <button className="text-white bg-yellow-500 hover:bg-yellow-600 rounded-full text-sm px-6 py-2">
              <a href="/signin">SignIn</a>
            </button>
            <button className="text-white bg-green-600 hover:bg-green-700 rounded-full text-sm px-6 py-2">
              <a href="/login">Login</a>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-white cursor-pointer" onClick={toggleSidebar}>
              <img className="w-10 h-10 rounded-full" src={userIcon} alt="User Icon" />
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
            <button className="text-white bg-yellow-500 hover:bg-yellow-600 rounded-full text-sm px-6 py-2">
              <a href="/signin">SignIn</a>
            </button>
            <button className="text-white bg-green-600 hover:bg-green-700 rounded-full text-sm px-6 py-2">
              <a href="/login">Login</a>
            </button>
          </div>
        </div>
      )}

      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}></div>
          <div className="fixed inset-y-5 right-3 bg-white w-80 p-3 z-50 shadow-lg rounded-lg overflow-y-auto h-auto">
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

                <button
                  className="bg-lime-400 text-black p-1 rounded-full w-full mt-2 hover:bg-yellow-300"
                  onClick={toggleVisibility}
                >
                  {showCode ? 'Hide' : 'Edit'}
                </button>

                {showCode && (
                  <div className="mt-4">
                    <div className="mb-4">
                      <label htmlFor="charges" className="block text-gray-700 text-sm font-bold mb-2">Charges:</label>
                      <input
                        type="text"
                        id="charges"
                        value={charges}
                        onChange={(e) => setCharges(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                                  setWorkingDays((prev) => [...prev, day]);
                                } else {
                                  setWorkingDays((prev) => prev.filter((selectedDay) => selectedDay !== day));
                                }
                              }}
                              className="mr-2"
                            />
                            <label htmlFor={day} className="text-gray-700">{day}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      className="bg-lime-500 text-black p-2 rounded-lg w-full hover:bg-yellow-300"
                      onClick={updateWorkerData}
                    >
                      Save Changes
                    </button>
                    {success && <p className="text-green-500 mt-2">{success}</p>}
                  </div>
                )}
               <div className="mt-4">
                <label className="inline-flex items-center cursor-pointer">
                  <span className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={availability}
                      onChange={toggleAvailability}
                    />
                    <span
                      className={`block w-16 h-8 bg-gray-400 rounded-full transition duration-200 ease-in-out ${availability ? 'bg-green-600' : 'bg-red-600'
                        }`}
                    >
                      <span
                        className={`absolute w-8 h-8 bg-white rounded-full transition transform ${availability ? 'translate-x-8' : 'translate-x-0'
                          }`}
                      ></span>
                    </span>
                  </span>
                  <span className="ml-3 text-lg text-gray-700">
                    {availability ? 'Available' : 'Busy'}
                  </span>
                </label>
                </div>
              </>
            ) : (
              <p>No worker data found</p>
            )}
          </div>
        </>
      )}


    </nav>
  );
};

export default WorkerNavbar;
