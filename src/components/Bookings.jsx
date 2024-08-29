import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Adjust the path according to your project structure
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Import necessary auth function

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerProfile, setCustomerProfile] = useState(null); // Add missing state for customer profile

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Fetch customer profile from Firestore
                    const customerDoc = doc(db, 'customers', user.uid); // Corrected 'doc' usage
                    const customerSnapshot = await getDoc(customerDoc); // Corrected 'getDoc' usage

                    if (customerSnapshot.exists()) {
                        setCustomerProfile(customerSnapshot.data()); // Update state with customer data
                        console.log("Customer Profile:", customerSnapshot.data()); // Debugging log
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
                setBookings([]); // Clear bookings if no user is logged in
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

            setBookings(bookingsData); // Update bookings state
            console.log("Fetched Bookings:", bookingsData); // Debugging log
        } catch (err) {
            setError(err.message); // Handle errors
            console.error('Error fetching bookings:', err);
        }
        setLoading(false); // Set loading to false after fetching
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="p-8 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">
                All Bookings
            </h2>
            {bookings.length === 0 ? (
                <p>No bookings available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-3 mb-10">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Customer ID:</strong> {booking.customerId}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message || 'No message provided'}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings;
