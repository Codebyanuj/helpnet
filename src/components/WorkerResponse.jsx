import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const WorkerResponse = ({ workerId }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                if (!workerId) {
                    throw new Error('workerId is undefined');
                }

                // Query to fetch bookings for the worker that are still pending
                const q = query(
                    collection(db, 'Bookings'),
                    where('workerId', '==', workerId),
                    where('status', '==', 'pending')
                );
                const querySnapshot = await getDocs(q);

                // Map the results to an array of booking data
                const bookingsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setBookings(bookingsData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching bookings:', err);
            }
        };

        fetchBookings();
    }, [workerId]);

    const handleResponse = async (bookingId, response) => {
        try {
            // Reference to the specific booking document
            const bookingRef = doc(db, 'Bookings', bookingId);

            // Update the booking status based on the worker's response
            await updateDoc(bookingRef, {
                status: response,
            });

            // Optionally, you could remove the booking from the list immediately
            setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
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
            {bookings.length === 0 ? (
                <p>No pending bookings.</p>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {bookings.map((booking) => (
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
        </div>
    );
};

export default WorkerResponse;
