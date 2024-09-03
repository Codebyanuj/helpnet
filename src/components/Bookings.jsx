import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Adjust the path according to your project structure
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Import necessary auth function

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerProfile, setCustomerProfile] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false); // State to control the review form visibility
    const [selectedBooking, setSelectedBooking] = useState(null); // State to track which booking is selected for review
    const [rating, setRating] = useState(0); // State to track rating
    const [review, setReview] = useState(''); // State to track review text

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const customerDoc = doc(db, 'customers', user.uid);
                    const customerSnapshot = await getDoc(customerDoc);

                    if (customerSnapshot.exists()) {
                        setCustomerProfile(customerSnapshot.data());
                        fetchCustomerBookings(user.uid);
                        
                    } else {
                        console.log('No such customer!');
                    }
                } catch (err) {
                    setError(err.message);
                    console.error('Error fetching customer profile:', err);
                }
            } else {
                setCustomerProfile(null);
                setBookings([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, db]);

    const fetchCustomerBookings = async (customerId) => {
        setLoading(true);
        try {
            const bookingsRef = collection(db, 'Bookings');
            const q = query(bookingsRef, where('customerId', '==', customerId));
            const querySnapshot = await getDocs(q);

            const bookingsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setBookings(bookingsData);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching bookings:', err);
        }
        setLoading(false);
    };



    //TO FETCH THE WORKER''S NAME
    const fetchWorker = async (workerId) => {
        setLoading(true);
        try {
            const workerdetails = collection(db, 'workers');
            const q = query(workerdetails, where('workerId', '==', workerId));
            const querySnapshot = await getDocs(q);

            const bookingsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setBookings(bookingsData);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching worker:', err);
        }
        setLoading(false);
    };
    // Function to handle "Complete" button click
    const handleCompleteClick = (booking) => {
        setSelectedBooking(booking); // Set the booking that is being reviewed
        setShowReviewForm(true); // Show the review form
    };

    // Function to handle the review submission
    const handleReviewSubmit = async () => {
        if (selectedBooking) {
            try {
                const bookingRef = doc(db, 'Bookings', selectedBooking.id);
                await updateDoc(bookingRef, {
                    status: 'Completed', // Update the status to completed
                    rating: rating, // Store the rating
                    review: review // Store the review text
                });

                // Reset form and state
                setShowReviewForm(false); // Hide the review form after submission
                setRating(0); // Reset rating
                setReview(''); // Reset review text
                setSelectedBooking(null); // Clear selected booking

                // Refresh bookings after review
                fetchCustomerBookings(customerProfile.id);
            } catch (err) {
                console.error('Error updating booking:', err);
            }
        }
    };

    // Function to render star rating
    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
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
                             <p><strong>Worker Name:</strong> {booking.name}</p>
                            <p><strong>Worker ID:</strong> {booking.workerId}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message || 'No message provided'}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <p><strong>Rating:</strong> {booking.rating ? renderStars(booking.rating) : 'No rating yet'}</p>
                            <p><strong>Review:</strong> {booking.review || 'No review provided'}</p>
                            {booking.status === 'completed' && (
                                <button
                                    onClick={() => handleCompleteClick(booking)}
                                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                                >
                                    Complete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Conditionally render the review form */}
            {showReviewForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Rate Your Experience</h3>
                        <div className="flex mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 w-full"
                            rows="4"
                            placeholder="Write your review here..."
                        />
                        <button
                            onClick={handleReviewSubmit}
                            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
                        >
                            Submit Review
                        </button>
                        <button
                            onClick={() => setShowReviewForm(false)}
                            className="bg-red-500 text-white px-4 py-2 mt-4 rounded ml-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
