import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';

const WorkerResponse = () => {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [acceptedBookings, setAcceptedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [workerId, setWorkerId] = useState(null);

    useEffect(() => {
        // Function to fetch bookings and corresponding customer details
        const fetchBookings = async (workerId) => {
            try {
                // Query to fetch bookings for the worker that are either pending or accepted
                const qPending = query(
                    collection(db, 'Bookings'),
                    where('workerId', '==', workerId),
                    where('status', '==', 'pending')
                );

                const qAccepted = query(
                    collection(db, 'Bookings'),
                    where('workerId', '==', workerId),
                    where('status', '==', 'accepted')
                );

                const [querySnapshotPending, querySnapshotAccepted] = await Promise.all([
                    getDocs(qPending),
                    getDocs(qAccepted)
                ]);

                // Function to fetch customer details based on customerId
                const fetchCustomerDetails = async (customerId) => {
                    try {
                        const customerRef = doc(db, 'customers', customerId);
                        const customerDoc = await getDoc(customerRef);
                        if (customerDoc.exists()) {
                            console.log('Customer data fetched:', customerDoc.data());
                            return customerDoc.data(); // Return customer data if it exists
                        } else {
                            console.log('No such customer document:', customerId);
                            return null;
                        }
                    } catch (err) {
                        console.error('Error fetching customer details:', err);
                        return null;
                    }
                };

                // Map the results to arrays of booking data with customer details
                const pendingData = await Promise.all(querySnapshotPending.docs.map(async (doc) => {
                    const bookingData = doc.data();
                    const customerData = await fetchCustomerDetails(bookingData.customerId); // Fetch customer data for each booking
                    return {
                        id: doc.id,
                        ...bookingData,
                        customerName: customerData ? customerData.name : 'Unknown', // Add customer name to booking data
                        customerAddress: customerData ? customerData.address : 'Unknown', // Add customer address to booking data
                    };
                }));

                const acceptedData = await Promise.all(querySnapshotAccepted.docs.map(async (doc) => {
                    const bookingData = doc.data();
                    const customerData = await fetchCustomerDetails(bookingData.customerId); // Fetch customer data for each booking
                    return {
                        id: doc.id,
                        ...bookingData,
                        customerName: customerData ? customerData.name : 'Unknown', // Add customer name to booking data
                        customerAddress: customerData ? customerData.address : 'Unknown', // Add customer address to booking data
                    };
                }));

                setPendingBookings(pendingData);
                setAcceptedBookings(acceptedData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching bookings:', err);
            }
        };

        // Listen for authentication state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, set the worker ID and fetch bookings
                setWorkerId(user.uid);
                fetchBookings(user.uid);
            } else {
                // User is signed out, clear bookings and worker ID
                setWorkerId(null);
                setPendingBookings([]);
                setAcceptedBookings([]);
                setLoading(false);
            }
        });

        // Clean up subscription on component unmount
        return () => unsubscribe();
    }, []);

    const handleResponse = async (bookingId, response) => {
        try {
            // Reference to the specific booking document
            const bookingRef = doc(db, 'Bookings', bookingId);

            // Update the booking status based on the worker's response
            await updateDoc(bookingRef, {
                status: response,
            });

            // Update the local state to reflect the change immediately
            if (response === 'accepted') {
                setPendingBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
                const acceptedBooking = pendingBookings.find((booking) => booking.id === bookingId);
                setAcceptedBookings((prev) => [...prev, { ...acceptedBooking, status: 'accepted' }]);
            } else if (response === 'declined') {
                setPendingBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            setError(`Error: ${error.message}`);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="p-8 bg-white shadow-md rounded-md ">
            <h2 className="text-2xl font-mono font-bold  mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Pending Booking Requests</h2>
            {pendingBookings.length === 0 ? (
                <p>No pending bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-3  mb-10">
                    {pendingBookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Customer Name:</strong> {booking.customerName}</p> {/* Display customer name */}
                            <p><strong>Customer Address:</strong> {booking.customerAddress}</p> {/* Display customer address */}
                            <p><strong>Customer ID:</strong> {booking.customerId}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message || 'No message provided'}</p>
                            <div className="mt-4 flex justify-around">
                                <button
                                    onClick={() => handleResponse(booking.id, 'accepted')}
                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleResponse(booking.id, 'declined')}
                                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <h2 className="text-2xl font-mono font-bold  mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Accepted Booking Requests</h2>
            {acceptedBookings.length === 0 ? (
                <p>No accepted bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {acceptedBookings.map((booking) => (
                        <div key={booking.id} className="bg-green-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Customer Name:</strong> {booking.customerName}</p> {/* Display customer name */}
                            <p><strong>Customer Address:</strong> {booking.customerAddress}</p> {/* Display customer address */}
                            <p><strong>Customer ID:</strong> {booking.customerId}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message || 'No message provided'}</p>
                            <p><strong>Status:</strong> Accepted</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkerResponse;
