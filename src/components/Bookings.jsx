import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import StarRating from './StarRating'

const CustomerBookings = () => {
    const [acceptedBookings, setAcceptedBookings] = useState([]);
    const [doneBookings, setDoneBookings] = useState([]);
    const [completedBookings, setCompletedBookings] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [declinedBookings, setDeclinedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(5);

    useEffect(() => {
        const fetchWorkerDetails = async (workerId) => {
            try {
                const workerDocRef = doc(db, 'Workers', workerId); // Use workerId as the document ID
                const workerDoc = await getDoc(workerDocRef);

                if (workerDoc.exists()) {
                    const workerData = workerDoc.data();
                    const { name, typeOfWork } = workerData; // Destructure the fields 'name' and 'TypeofWork'
                    return { name, typeOfWork }; // Return both name and TypeofWork
                } else {
                    console.log('No such worker!');
                    return { name: 'Unknown Worker', typeOfWork: 'Unknown Work' };
                }
            } catch (error) {
                console.error('Error fetching worker details:', error);
                return { name: 'Unknown Worker', typeOfWork: 'Unknown Work' };
            }
        };

        const fetchBookings = async (customerId) => {
            try {
                const statusQueries = {
                    accepted: query(collection(db, 'Bookings'), where('customerId', '==', customerId), where('status', '==', 'accepted')),
                    done: query(collection(db, 'Bookings'), where('customerId', '==', customerId), where('status', '==', 'Done')),
                    completed: query(collection(db, 'Bookings'), where('customerId', '==', customerId), where('status', '==', 'completed')),
                    pending: query(collection(db, 'Bookings'), where('customerId', '==', customerId), where('status', '==', 'pending')),
                    declined: query(collection(db, 'Bookings'), where('customerId', '==', customerId), where('status', '==', 'declined'))
                };

                const querySnapshots = await Promise.all(Object.values(statusQueries).map(q => getDocs(q)));

                const mapBookingDataWithWorkerName = async (doc) => {
                    const bookingData = doc.data();
                    const workerDetails = await fetchWorkerDetails(bookingData.workerId); return {
                        id: doc.id,
                        ...bookingData,
                        workerDetails,
                    };
                };

                const [accepted, done, completed, pending, declined] = await Promise.all(
                    querySnapshots.map(snapshot => Promise.all(snapshot.docs.map(mapBookingDataWithWorkerName)))
                );

                setAcceptedBookings(accepted);
                setDoneBookings(done);
                setCompletedBookings(completed);
                setPendingBookings(pending);
                setDeclinedBookings(declined);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching bookings:', err);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchBookings(user.uid);
            } else {
                setAcceptedBookings([]);
                setDoneBookings([]);
                setCompletedBookings([]);
                setPendingBookings([]);
                setDeclinedBookings([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleComplete = async (bookingId, rating) => {
        try {
            const bookingRef = doc(db, 'Bookings', bookingId);
            await updateDoc(bookingRef, {
                status: 'completed',
                rating: rating,
            });

            setDoneBookings(prev => prev.filter(booking => booking.id !== bookingId));
            const completedBooking = doneBookings.find(booking => booking.id === bookingId);
            setCompletedBookings(prev => [...prev, { ...completedBooking, status: 'completed', rating }]);
        } catch (error) {
            console.error('Error updating booking status to completed:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="p-8 bg-white shadow-md rounded-md">
            {/* Pending Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Pending Bookings</h2>
            {pendingBookings.length === 0 ? (
                <p>No pending bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {pendingBookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Worker Name:</strong> {booking.workerDetails.name}</p>
                            <p><strong>TypeofWork:</strong> {booking.workerDetails?.typeOfWork || 'Unknown Work'}</p>
                            <p><strong>Booking Status:</strong> {booking.status}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Declined Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Declined Bookings</h2>
            {declinedBookings.length === 0 ? (
                <p>No declined bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {declinedBookings.map((booking) => (
                        <div key={booking.id} className="bg-red-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Worker Name:</strong> {booking.workerDetails.name}</p>
                            <p><strong>TypeofWork:</strong> {booking.workerDetails?.typeOfWork || 'Unknown Work'}</p>
                            <p><strong>Booking Status:</strong> {booking.status}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Accepted Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Accepted Bookings</h2>
            {acceptedBookings.length === 0 ? (
                <p>No accepted bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {acceptedBookings.map((booking) => (
                        <div key={booking.id} className="bg-green-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Worker Name:</strong> {booking.workerDetails.name}</p>
                            <p><strong>TypeofWork:</strong> {booking.workerDetails?.typeOfWork || 'Unknown Work'}</p>
                            <p><strong>Booking Status:</strong> {booking.status}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Bookings Ready for Completion */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Bookings Ready for Completion</h2>
            {doneBookings.length === 0 ? (
                <p>No bookings to complete.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {doneBookings.map((booking) => (
                        <div key={booking.id} className="bg-yellow-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Worker Name:</strong> {booking.workerDetails.name}</p>
                            <p><strong>TypeofWork:</strong> {booking.workerDetails?.typeOfWork || 'Unknown Work'}</p>
                            <p><strong>Booking Status:</strong> {booking.status}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                           
                                <div className="mt-4">
                                    <label htmlFor="rating" className="block">Rate the Worker:</label>
                                    <StarRating rating={rating} setRating={setRating} />
                                    <button
                                        onClick={() => handleComplete(booking.id, rating)}
                                        className="bg-green-500 text-white rounded px-4 py-2 mt-2"
                                    >
                                        Complete Booking
                                    </button>
                                </div>
                             
                            </div>
                        
                    ))}
                </div>
            )}

            {/* Completed Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Completed Bookings</h2>
            {completedBookings.length === 0 ? (
                <p>No completed bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {completedBookings.map((booking) => (
                        <div key={booking.id} className="bg-blue-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Worker Name:</strong> {booking.workerDetails.name}</p>
                            <p><strong>TypeofWork:</strong> {booking.workerDetails?.typeOfWork || 'Unknown Work'}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Rating:</strong> {booking.rating}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerBookings;
