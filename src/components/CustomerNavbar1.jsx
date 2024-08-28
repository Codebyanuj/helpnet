import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import userIcon from '../components/Icons/user1.png'; // Import user icon

const Navbar = () => {
  // State to manage the visibility of the mobile menu and sidebar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customerProfile, setCustomerProfile] = useState(null); // State to hold customer profile data
  const [bookings, setBookings] = useState([]); // State to hold customer bookings data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Firebase authentication and Firestore instances
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {


    const fetchWorkerDetails = async (workerId) => {
      try {
          const workerRef = doc(db, 'workers', workerId);
          const workerDoc = await getDoc(workerRef);
          if (workerDoc.exists()) {
              console.log('worker data fetched:', workerDoc.data());
              return workerDoc.data(); // Return worker data if it exists
          } else {
              console.log('No such worker document:', workerId);
              return null;
          }
      } catch (err) {
          console.error('Error fetching worker details:', err);
          return null;
      }
  };




    // Set up listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch customer profile from Firestore
          const customerDoc = doc(db, 'customers', user.uid);
          const customerSnapshot = await getDoc(customerDoc);

          if (customerSnapshot.exists()) {
            setCustomerProfile(customerSnapshot.data()); // Update state with customer data
            fetchCustomerBookings(user.uid); // Fetch customer's bookings
          } else {
            console.log('No such customer!');
          }
        } catch (err) {
          setError(err.message); // Handle errors
          console.error('Error fetching customer profile:', err);
        }
      } else {
        setCustomerProfile(null); // Clear profile data if no user is logged in
      }
      setLoading(false); // Set loading to false after fetching
    });

    return () => unsubscribe(); // Clean up subscription on component unmount
  }, [auth, db]);

  // Function to fetch customer's booking data
  const fetchCustomerBookings = async (customerId) => {
    setLoading(true); // Set loading to true while fetching
    try {
      // Query to fetch bookings where customerId matches the current user's ID
      const bookingsRef = collection(db, 'Bookings');
      const q = query(bookingsRef, where('customerId', '==', customerId));
      const querySnapshot = await getDocs(q);

      // Map through the documents and extract booking data
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      

     //saves the array into the bookings of setbookings
      setBookings(bookingsData); // Update bookings state
    } catch (err) {
      setError(err.message); // Handle errors
      console.error('Error fetching bookings:', err);
    }
    setLoading(false); // Set loading to false after fetching
  };

  // Function to toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-800 to-gray-900 shadow-lg p-4 mx-3 mt-3 border-2 border-gray-700 rounded-xl">
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
          <button
            type="button"
            className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
          >
            <a href="/signin">SignIn</a>
          </button>

          <button
            type="button"
            className="text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
          >
            <a href="/login">Login</a>
          </button>

          {/* Button to open the sidebar which contains user logoo image*/}
          <button
            type="button"
            className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-full text-sm px-2 py-2 text-center"
            onClick={toggleSidebar}
          >
            <img className='w-10 h-10' src={userIcon} alt="User" />
          </button>

          {/* Hamburger Menu for mobile screens */}
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

      {/* Mobile Navigation Links */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 text-center mt-4">
          <a href="/" className="text-white hover:text-cyan-400 transition duration-300">Home</a>
          <a href="/about" className="text-white hover:text-cyan-400 transition duration-300">About</a>
          <a href="/Container" className="text-white hover:text-cyan-400 transition duration-300">Categories</a>
          <a href="/help" className="text-white hover:text-cyan-400 transition duration-300">Help</a>

          <div className="flex justify-center space-x-4">
            {!customerProfile ? (
              <>
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
                >
                  <a href="/signin">SignIn</a>
                </button>

                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
                >
                  <a href="/login">Login</a>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-full text-sm px-2 py-2 text-center"
                onClick={toggleSidebar}
              >
                <img className='w-10 h-10' src={userIcon} alt="User" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sidebar */}
      {isSidebarOpen && (
        <>
          {/* Background overlay to close sidebar on click */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}></div>

          {/* Sidebar container */}
          <div className="fixed inset-y-10 right-10 bg-white w-84 p-6 z-50 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            {loading ? (
              <p>Loading...</p> // Display loading message while fetching data
            ) : error ? (
              <p className="text-red-500">{error}</p> // Display error message if an error occurred
            ) : customerProfile ? (
              <div>
                {/* User Profile Information */}
                <div className="flex items-center space-x-4 mb-4">
                  <img src={userIcon} alt="Profile" className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="text-lg font-semibold">{customerProfile.name}</h3>
                    <p>{customerProfile.email}</p>
                  </div>
                </div>

                {/* Booking Information */}
                <h3 className="text-lg font-semibold mb-2">Booking Updates</h3>
                {bookings.length > 0 ? (
                  <ul className="space-y-2">
                    {bookings.map((booking) => (
                      <li key={booking.id} className="border border-gray-300 p-2 rounded">
                        <p><strong>Booking ID:</strong> {booking.id}</p>
                        <p><strong>Worker Namee:</strong> {booking.workerName}</p>
                        <p><strong>Worker:</strong> {booking.workerId}</p>
                        <p><strong>Date:</strong> {booking.date}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No bookings available.</p>
                )}

                {/* Settings and Logout Links */}
                <a href="/settings" className="block mt-4 text-cyan-600 hover:text-cyan-400">Settings</a>
                <a href="/logout" className="block mt-2 text-red-600 hover:text-red-400">Logout</a>
              </div>
            ) : (
              <p>No profile data available.</p>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
