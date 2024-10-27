import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Ensure this import is correct

const handleLogout = () => {
  const isConfirmed = window.confirm("Are you sure you want to log out?");
  
  if (isConfirmed) {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        // You can redirect or perform any other actions after logout
        window.location.href = "/";  // Redirect to home page or login page after logout
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }
};

const LogoutButton = () => {
  return (
    <button 
      onClick={handleLogout}
      className="w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded-full mt-2"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
