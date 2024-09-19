import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

// Define your Google Maps API Key here
const API_KEY = 'AIzaSyC5dzGT4q82H8A0X63jToYoYKu_vuo3F6I'; // Replace with your actual API key

const mapContainerStyle = {
    width: '100%',
    height: '300px',
};

const WorkerResponse = () => {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [acceptedBookings, setAcceptedBookings] = useState([]);
    const [completedBookings, setCompletedBookings] = useState([]);
    const [doneBookings, setDoneBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [workerId, setWorkerId] = useState(null);
    const [rating, setRating] = useState(5);
    const [showDialog, setShowDialog] = useState(false);
    const [bookingToComplete, setBookingToComplete] = useState(null);
    const [mapVisible, setMapVisible] = useState(false); // State to control map visibility

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_KEY, // Google Maps API Key
    });

    useEffect(() => {
        const fetchBookings = async (workerId) => {
            try {
                // Fetch bookings for different statuses
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

                const qCompleted = query(
                    collection(db, 'Bookings'),
                    where('workerId', '==', workerId),
                    where('status', '==', 'completed')
                );

                const qDone = query(
                    collection(db, 'Bookings'),
                    where('workerId', '==', workerId),
                    where('status', '==', 'done')
                );

                const [querySnapshotPending, querySnapshotAccepted, querySnapshotCompleted, querySnapshotDone] = await Promise.all([
                    getDocs(qPending),
                    getDocs(qAccepted),
                    getDocs(qCompleted),
                    getDocs(qDone)
                ]);

                const fetchCustomerDetails = async (customerId) => {
                    try {
                        const customerRef = doc(db, 'customers', customerId);
                        const customerDoc = await getDoc(customerRef);
                        if (customerDoc.exists()) {
                            return customerDoc.data();
                        } else {
                            return null;
                        }
                    } catch (err) {
                        console.error('Error fetching customer details:', err);
                        return null;
                    }
                };

                const mapBookingData = async (doc) => {
                    const bookingData = doc.data();
                    const customerData = await fetchCustomerDetails(bookingData.customerId);
                    return {
                        id: doc.id,
                        ...bookingData,
                        customerName: customerData ? customerData.name : 'Unknown',
                        customerAddress: customerData ? customerData.address : 'Unknown',
                        latitude: bookingData.latitude || null,
                        longitude: bookingData.longitude || null,
                        customerRating: bookingData.rating || 'No rating given',
                    };
                };

                const pendingData = await Promise.all(querySnapshotPending.docs.map(mapBookingData));
                const acceptedData = await Promise.all(querySnapshotAccepted.docs.map(mapBookingData));
                const completedData = await Promise.all(querySnapshotCompleted.docs.map(mapBookingData));
                const doneData = await Promise.all(querySnapshotDone.docs.map(mapBookingData));

                setPendingBookings(pendingData);
                setAcceptedBookings(acceptedData);
                setCompletedBookings(completedData);
                setDoneBookings(doneData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching bookings:', err);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setWorkerId(user.uid);
                fetchBookings(user.uid);
            } else {
                setWorkerId(null);
                setPendingBookings([]);
                setAcceptedBookings([]);
                setCompletedBookings([]);
                setDoneBookings([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleResponse = async (bookingId, response) => {
        try {
            const bookingRef = doc(db, 'Bookings', bookingId);
            await updateDoc(bookingRef, { status: response });

            if (response === 'accepted') {
                setPendingBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
                const acceptedBooking = pendingBookings.find((booking) => booking.id === bookingId);
                setAcceptedBookings((prev) => [...prev, { ...acceptedBooking, status: 'accepted' }]);
            } else if (response === 'declined') {
                setPendingBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
            } else if (response === 'completed') {
                setAcceptedBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
                const completedBooking = acceptedBookings.find((booking) => booking.id === bookingId);
                setCompletedBookings((prev) => [...prev, { ...completedBooking, status: 'completed' }]);
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            setError(`Error: ${error.message}`);
        }
    };

    const handleComplete = (bookingId) => {
        setBookingToComplete(bookingId);
        setShowDialog(true);
    };

    const confirmCompletion = () => {
        if (bookingToComplete) {
            handleResponse(bookingToComplete, 'completed');
            setShowDialog(false);
            setBookingToComplete(null);
        }
    };

    const cancelCompletion = () => {
        setShowDialog(false);
        setBookingToComplete(null);
    };

    const renderGoogleMap = (latitude, longitude) => {
        return isLoaded && latitude && longitude ? (
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat: latitude, lng: longitude }}
                zoom={12}
            >
                <Marker position={{ lat: latitude, lng: longitude }} />
            </GoogleMap>
        ) : (
            <p>Loading map...</p>
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
            {/* Pending Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Pending Bookings</h2>
            {pendingBookings.length === 0 ? (
                <p>No pending bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {pendingBookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Customer Name:</strong> {booking.customerName}</p>
                            <p><strong>Customer Address:</strong> {booking.customerAddress}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <button
                                onClick={() => setMapVisible(!mapVisible)}
                                className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                            >
                                {mapVisible ? 'Hide Map' : 'Show Map'}
                            </button>
                            {mapVisible && renderGoogleMap(booking.latitude, booking.longitude)}
                            <div className="mt-4">
                                <button
                                    onClick={() => handleResponse(booking.id, 'accepted')}
                                    className="bg-green-500 text-white rounded px-4 py-2 mt-2"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleResponse(booking.id, 'declined')}
                                    className="bg-red-500 text-white rounded px-4 py-2 mt-2"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Declined Bookings
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Declined Bookings</h2>
            {declinedBookings.length === 0 ? (
                <p>No declined bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {declinedBookings.map((booking) => (
                        <div key={booking.id} className="bg-red-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Customer Name:</strong> {booking.customerName}</p>
                            <p><strong>Customer Address:</strong> {booking.customerAddress}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <button
                                onClick={() => setMapVisible(!mapVisible)}
                                className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                            >
                                {mapVisible ? 'Hide Map' : 'Show Map'}
                            </button>
                            {mapVisible && renderGoogleMap(booking.latitude, booking.longitude)}
                        </div>
                    ))}
                </div>
            )} */}

            {/* Accepted Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Accepted Bookings</h2>
            {acceptedBookings.length === 0 ? (
                <p>No accepted bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {acceptedBookings.map((booking) => (
                        <div key={booking.id} className="bg-yellow-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Customer Name:</strong> {booking.customerName}</p>
                            <p><strong>Customer Address:</strong> {booking.customerAddress}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <button
                                onClick={() => setMapVisible(!mapVisible)}
                                className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                            >
                                {mapVisible ? 'Hide Map' : 'Show Map'}
                            </button>
                            {mapVisible && renderGoogleMap(booking.latitude, booking.longitude)}
                            <div className="mt-4">
                                <button
                                    onClick={() => handleComplete(booking.id)}
                                    className="bg-yellow-500 text-white rounded px-4 py-2 mt-2"
                                >
                                    Mark as Completed
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {completedBookings.map((booking) => (
                        <div key={booking.id} className="bg-green-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Customer Name:</strong> {booking.customerName}</p>
                            <p><strong>Customer Address:</strong> {booking.customerAddress}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <button
                                onClick={() => setMapVisible(!mapVisible)}
                                className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                            >
                                {mapVisible ? 'Hide Map' : 'Show Map'}
                            </button>
                            {mapVisible && renderGoogleMap(booking.latitude, booking.longitude)}
                        </div>
                    ))}
                </div>
            )}

            {/* Done Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Done Bookings</h2>
            {doneBookings.length === 0 ? (
                <p>No done bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {doneBookings.map((booking) => (
                        <div key={booking.id} className="bg-blue-100 p-4 rounded-lg shadow-sm">
                            <p><strong>Customer Name:</strong> {booking.customerName}</p>
                            <p><strong>Customer Address:</strong> {booking.customerAddress}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <button
                                onClick={() => setMapVisible(!mapVisible)}
                                className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                            >
                                {mapVisible ? 'Hide Map' : 'Show Map'}
                            </button>
                            {mapVisible && renderGoogleMap(booking.latitude, booking.longitude)}
                        </div>
                    ))}
                </div>
            )}

            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold">Confirm Completion</h3>
                        <p>Are you sure you want to mark this booking as completed?</p>
                        <div className="mt-4">
                            <button onClick={confirmCompletion} className="bg-green-500 text-white rounded px-4 py-2 mr-2">Yes</button>
                            <button onClick={cancelCompletion} className="bg-red-500 text-white rounded px-4 py-2">No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerResponse;
