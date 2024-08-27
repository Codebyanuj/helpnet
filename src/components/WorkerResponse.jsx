import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const WorkerResponse = () => {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [acceptedBookings, setAcceptedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [workerId, setWorkerId] = useState(null);

    useEffect(() => {
        // Function to fetch bookings
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

                // Map the results to arrays of booking data
                const pendingData = querySnapshotPending.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const acceptedData = querySnapshotAccepted.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
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
        <div className="p-8 bg-white shadow-md rounded-md max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6">Pending Booking Requests</h2>
            {pendingBookings.length === 0 ? (
                <p>No pending bookings.</p>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {pendingBookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
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

            <h2 className="text-2xl font-bold mb-6 mt-8">Accepted Booking Requests</h2>
            {acceptedBookings.length === 0 ? (
                <p>No accepted bookings.</p>
            ) : (
                <div className="grid grid-cols-1 max-width-7xl gap-8">
                    {acceptedBookings.map((booking) => (
                        <div key={booking.id} className="bg-green-100 p-4 rounded-lg shadow-sm">
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
