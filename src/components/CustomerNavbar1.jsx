// import React, { useState } from 'react';

// const Navbar = () => {
//   // State to manage the visibility of the mobile menu
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [customer, setWorker] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Function to toggle the mobile menu
//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <nav className="bg-gradient-to-r from-purple-950 to-black shadow-lg p-4 mx-3 mt-3 border-2 border-gray-700 rounded-xl">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <div className="flex items-center space-x-1">
//           <div className="bg-cyan-500 p-2 rounded-full">
//             <span className="text-white text-2xl font-extrabold font-mono">H</span>
//           </div>
//           <span className="text-white text-2xl font-extrabold font-mono">Helpnet</span>
//         </div>

//         {/* Navigation links */}
//         <div className="hidden md:flex space-x-12 text-lg font-serif">
//           <a href="/" className="text-white hover:text-cyan-400 transition duration-300">Home</a>
//           <a href="/Aboutus" className="text-white hover:text-cyan-400 transition duration-300">About</a>
//           <a href="/Container" className="text-white hover:text-cyan-400 transition duration-300">Categories</a>
//           <a href="/Help" className="text-white hover:text-cyan-400 transition duration-300">Help</a>
//         </div>

//         {/* Right-aligned buttons and Hamburger Menu */}
//         <div className="flex items-center space-x-4">
//           {/* Search bar */}
//           <input
//             type="text"
//             placeholder="Search..."
//             className="hidden md:block p-2 rounded-full text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//           />

//           {/* SignIn and Login buttons on large screens */}
//           <div className="hidden md:flex space-x-4"> {/* Buttons are shown only on medium and larger screens */}
//             <button
//               type="button"
//               className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
//             >
//               <a href="SignType">SignIn</a>
//             </button>

//             <button
//               type="button"
//               className="text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
//             >
//               <a href="login">Login</a>
//             </button>
//           </div>




//            {/* Code for the responsiveness of the Hamburger on the smaller screen */}
//           {/* Hamburger Menu on small screens */}
//           <div className="md:hidden flex items-center"> {/* Hamburger menu is shown only on small screens */}
//             <button
//               type="button"
//               className="text-white focus:outline-none"
//               aria-label="Toggle navigation"
//               onClick={toggleMobileMenu} // Toggle the menu on click
//             >
//               <svg
//                 className="w-8 h-8"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 ></path>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation Links */}
//       {isMobileMenuOpen && ( // Show the links only if the menu is open
//         <div className="md:hidden flex flex-col space-y-4 text-center mt-4">
//           <a href="/" className="text-white hover:text-cyan-400 transition duration-300">Home</a>
//           <a href="/about" className="text-white hover:text-cyan-400 transition duration-300">About</a>
//           <a href="/Container" className="text-white hover:text-cyan-400 transition duration-300">Categories</a>
//           <a href="/help" className="text-white hover:text-cyan-400 transition duration-300">Help</a>

//           {/* Mobile Right-aligned buttons */}
//           <div className="flex justify-center space-x-4">
//             <button
//               type="button"
//               className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
//             >
//               <a href="SignType">SignIn</a>
//             </button>

//             <button
//               type="button"
//               className="text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
//             >
//               <a href="login">Login</a>
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import user from '../components/Icons/user1.png'; // Adjust the import path as necessary

const Navbar = () => {
  // State to manage the visibility of the mobile menu and sidebar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customerProfile, setCustomerProfile] = useState(null); // State to hold customer profile data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Firebase authentication and Firestore instances
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Set up listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch customer profile from Firestore
          const customerDoc = doc(db, 'customers', user.uid); // Assuming the collection is named 'customers'
          const customerSnapshot = await getDoc(customerDoc);

          if (customerSnapshot.exists()) {
            setCustomerProfile(customerSnapshot.data()); // Update state with customer data
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

  // Function to toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to toggle the sidebar
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
         
        
              <button
                type="button"
                className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-full text-sm px-2 py-2 text-center"
                onClick={toggleSidebar}
              >
                <img  className='w-10 h-10' src={user} alt="" />
              </button>
           

          {/* Hamburger Menu */}
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

          {/* Mobile Right-aligned buttons */}
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
                className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-semibold rounded-full text-sm px-7 py-2 text-center"
                onClick={toggleSidebar}
              >
                {customerProfile.name || 'Profile'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sidebar for Customer Profile */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-5 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}></div>
          <div className="fixed inset-y-10 right-10 bg-white w-84 p-6 z-50 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : customerProfile ? (
              <div>
                <div className="flex items-center space-x-4">
                  <img src={user} alt="Profile" className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="text-lg font-semibold">{customerProfile.name}</h3>
                    <p>{customerProfile.email}</p>
                  </div>
                </div>
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
