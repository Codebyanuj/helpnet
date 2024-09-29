import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import StarRating from './StarRating'; // Assuming you have this component

const CustomerBookings = () => {
    const [acceptedBookings, setAcceptedBookings] = useState([]);
    const [doneBookings, setDoneBookings] = useState([]);
    const [completedBookings, setCompletedBookings] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [declinedBookings, setDeclinedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState(''); // State for review text

    useEffect(() => {
        const fetchWorkerDetails = async (workerId) => {
            try {
                const workerDocRef = doc(db, 'Workers', workerId);
                const workerDoc = await getDoc(workerDocRef);

                if (workerDoc.exists()) {
                    const workerData = workerDoc.data();
                    const { name, typeOfWork, phone } = workerData;
                    return { name, typeOfWork, phone };
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
                    done: query(collection(db, 'Bookings'), where('customerId', '==', customerId), where('status', '==', 'done')),
                    completed: query(collection(db, 'Bookings'), where('customerId', '==', customerId), where('status', '==', 'completed')),
                    pending: query(collection(db, 'Bookings'), where('customerId', '==', customerId), where('status', '==', 'pending')),
                    declined: query(collection(db, 'Bookings'), where('customerId', '==', customerId), where('status', '==', 'declined'))
                };

                const querySnapshots = await Promise.all(Object.values(statusQueries).map(q => getDocs(q)));

                const mapBookingDataWithWorkerName = async (doc) => {
                    const bookingData = doc.data();
                    const workerDetails = await fetchWorkerDetails(bookingData.workerId);
                    return {
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

    const handleComplete = async (bookingId) => {
        if (window.confirm('Are you sure you want to mark this booking as complete?')) {
            try {
                const bookingRef = doc(db, 'Bookings', bookingId);
                await updateDoc(bookingRef, {
                    status: 'completed',
                });

                setDoneBookings(prev => prev.filter(booking => booking.id !== bookingId));
                const completedBooking = doneBookings.find(booking => booking.id === bookingId);
                setCompletedBookings(prev => [...prev, { ...completedBooking, status: 'completed' }]);

                alert('Booking has been successfully marked as completed!');
            } catch (error) {
                console.error('Error updating booking status to completed:', error);
            }
        }
    };

    const handleReviewSubmit = async (bookingId) => {
        try {
            const bookingRef = doc(db, 'Bookings', bookingId);
            await updateDoc(bookingRef, {
                rating: rating,
                review: review,
                status: 'completed' // Automatically mark as completed once review is submitted
            });

            setDoneBookings(prev => prev.filter(booking => booking.id !== bookingId));
            const updatedBooking = doneBookings.find(booking => booking.id === bookingId);
            setCompletedBookings(prev => [...prev, { ...updatedBooking, rating, review, status: 'completed' }]);

            alert('Review and rating submitted, and booking marked as completed!');
        } catch (error) {
            console.error('Error submitting review and updating booking status:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="p-8 bg-white shadow-md rounded-md font-mono">
            {/* Pending Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg shadow-lg shadow-black">Pending Bookings</h2>
            {pendingBookings.length === 0 ? (
                <p>No pending bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {pendingBookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-100 p-4 rounded-lg shadow-md shadow-orange-950">
                            <p><strong>Worker Name:</strong> {booking.workerDetails.name}</p>
                            <p><strong>TypeofWork:</strong> {booking.workerDetails?.typeOfWork || 'Unknown Work'}</p>
                            <p><strong>Phone Number:</strong> {booking.workerDetails.phone}</p>
                            <p><strong>Booking Status:</strong> {booking.status}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Declined Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg shadow-lg shadow-black">Declined Bookings</h2>
            {declinedBookings.length === 0 ? (
                <p>No declined bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {declinedBookings.map((booking) => (
                        <div key={booking.id} className="bg-red-100 p-4 rounded-lg shadow-md shadow-orange-950">
                            <p><strong>Worker Name:</strong> {booking.workerDetails.name}</p>
                            <p><strong>TypeofWork:</strong> {booking.workerDetails?.typeOfWork || 'Unknown Work'}</p>
                            <p><strong>Phone Number:</strong> {booking.workerDetails.phone}</p>
                            <p><strong>Booking Status:</strong> {booking.status}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message}</p>

                        </div>
                    ))}
                </div>
            )}

            {/* Accepted Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg shadow-lg shadow-black">Accepted Bookings</h2>
            {acceptedBookings.length === 0 ? (
                <p>No accepted bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {acceptedBookings.map((booking) => (
                        <div key={booking.id} className="bg-green-100 p-4 rounded-lg shadow-md shadow-orange-950">
                            <p><strong>Worker Name:</strong> {booking.workerDetails.name}</p>
                            <p><strong>TypeofWork:</strong> {booking.workerDetails?.typeOfWork || 'Unknown Work'}</p>
                            <p><strong>Phone Number:</strong> {booking.workerDetails.phone}</p>
                            <p><strong>Booking Status:</strong> {booking.status}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Done Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg shadow-lg shadow-black">Done Bookings</h2>
            {doneBookings.length === 0 ? (
                <p>No bookings marked as done.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {doneBookings.map((booking) => (
                        <div key={booking.id} className="bg-blue-100 p-4 rounded-lg shadow-md shadow-orange-950">
                            <p><strong>Worker Name:</strong> {booking.workerDetails.name}</p>
                            <p><strong>TypeofWork:</strong> {booking.workerDetails?.typeOfWork || 'Unknown Work'}</p>
                            <p><strong>Phone Number:</strong> {booking.workerDetails.phone}</p>
                            <p><strong>Booking Status:</strong> {booking.status}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message}</p>

                            <StarRating rating={rating} setRating={setRating} />
                            <textarea
                                className="w-full p-2 border rounded mt-2"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Leave your review here"
                            />
                            <button
                                onClick={() => handleReviewSubmit(booking.id)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                            >
                                Submit Review & Complete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Completed Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg shadow-lg shadow-black">Completed Bookings</h2>
            {completedBookings.length === 0 ? (
                <p>No completed bookings yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {completedBookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-300 p-4 rounded-lg shadow-md shadow-orange-950">
                            <p><strong>Worker Name:</strong> {booking.workerDetails.name}</p>
                            <p><strong>TypeofWork:</strong> {booking.workerDetails?.typeOfWork || 'Unknown Work'}</p>
                            <p><strong>Phone Number:</strong> {booking.workerDetails.phone}</p>
                            <p><strong>Booking Status:</strong> {booking.status}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message}</p>
                            

                            {/* Display Star Rating */}
                            <p><strong>Rating:</strong></p>
                            {booking.rating ? (
                                <StarRating rating={booking.rating} readOnly={true} />
                            ) : (
                                <p>No rating yet</p>
                            )}
                            <p><strong>Review:</strong> {booking.review || 'No review yet'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerBookings;
