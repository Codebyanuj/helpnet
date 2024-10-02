import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import StarRating from './StarRating'; // Assuming you have this component


// Define your Google Maps API Key here
const API_KEY = 'AIzaSyC5dzGT4q82H8A0X63jToYoYKu_vuo3F6I'; // Replace with your actual API key

// Add the directionServiceOptions function here
const directionServiceOptions = (origin, destination) => ({
    origin: origin,
    destination: destination,
    travelMode: window.google.maps.TravelMode.DRIVING,
});


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
    const [ConfirmationState, setConfirmationState] = useState(null); // Track which booking is in confirmation state
    const [pendingAction, setPendingAction] = useState({ bookingId: null, action: null });
    const [mapVisible, setMapVisible] = useState(false); // State to control map visibility
    const [selectedBooking, setSelectedBooking] = useState(null);

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

                    // Fetch task location (latitude and longitude)
                    const taskLocation = bookingData.taskLocation || {};
                    const workerLocation= bookingData.workerLocation||{};

                    return {
                        id: doc.id,
                        ...bookingData,
                        customerName: customerData ? customerData.name : 'Unknown',
                        customerAddress: customerData ? customerData.address : 'Unknown',
                        latitude: taskLocation.latitude || null,
                        longitude: taskLocation.longitude || null,
                        workerLat: workerLocation.latitude || null, // Fetch worker location from booking data
                        workerLng: workerLocation.longitude || null,
                        customerRating: bookingData.rating || 'No rating given',
                    };
                };

                const pendingData = await Promise.all(querySnapshotPending.docs.map(mapBookingData));
                const acceptedData = await Promise.all(querySnapshotAccepted.docs.map(mapBookingData));
                const completedData = await Promise.all(querySnapshotCompleted.docs.map(mapBookingData));
                const doneData = await Promise.all(querySnapshotDone.docs.map(mapBookingData));

                setPendingBookings(pendingData);
                setAcceptedBookings(acceptedData);
                setDoneBookings(doneData);
                setCompletedBookings(completedData);

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
                setDoneBookings([]);
                setCompletedBookings([]);
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
            } else if (response === 'done') {
                setAcceptedBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
                const completedBooking = acceptedBookings.find((booking) => booking.id === bookingId);
                setDoneBookings((prev) => [...prev, { ...completedBooking, status: 'done' }]); // Move to done
            } else if (response === 'completed') {
                setDoneBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
                const doneBooking = doneBookings.find((booking) => booking.id === bookingId);
                setCompletedBookings((prev) => [...prev, { ...doneBooking, status: 'completed' }]); // Move to completed
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            setError(`Error: ${error.message}`);
        }
    };


    //HANDLE ACCEPT BOOKING CONFIRMTION

    const handleInitiateResponse = (bookingId, action) => {
        // Set the bookingId and the intended action (either 'accept' or 'decline')
        setPendingAction({ bookingId, action });
    };

    const handleConfirmResponse = () => {
        // Proceed with the pending action
        handleResponse(pendingAction.bookingId, pendingAction.action);
        // Reset the pending action state
        setPendingAction({ bookingId: null, action: null });
    };

    const cancelResponse = () => {
        // Cancel the action and reset state
        setPendingAction({ bookingId: null, action: null });
    };


    //HANDLE DONE 

    const handleMarkAsDone = (bookingId) => {
        // Set the bookingId to initiate confirmation process
        setConfirmationState(bookingId);
    };

    const confirmDone = (bookingId) => {
        // Handle the completion confirmation (e.g., update the booking status)
        handleResponse(bookingId, 'done');
        setConfirmationState(null); // Reset confirmation state after confirming
    };

    const cancelDone = () => {
        setConfirmationState(null); // Cancel the confirmation process
    };


    //HANDLE COMPLETE

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

    //FUNCTIONLITY TO SHOW DIRECTION ON THE MAP

   
  

        const handleShowDirections = async (booking) => {
            setSelectedBooking(booking);
    
            const directionsService = new window.google.maps.DirectionsService();
            const origin = { lat: booking.workerLat, lng: booking.workerLng }; // Use worker's location
            const destination = { lat: booking.latitude, lng: booking.longitude }; // Customer's task location
    
            const results = await directionsService.route(directionServiceOptions(origin, destination));
            setDirectionsResponse(results);
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
        <div className="p-8 bg-white shadow-md rounded-md font-mono">
            {/* Pending Bookings */}
            <h2 className="text-2xl font-mono font-bold mb-6 text-center text-white bg-gradient-to-r to-amber-900 from-blue-700 rounded-lg">Pending Bookings</h2>
            {pendingBookings.length === 0 ? (
                <p>No pending bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {pendingBookings.map((booking) => (
                        <div key={booking.id} className="bg-yellow-100 p-4 rounded-lg hover:bg-yellow-200 shadow-lg shadow-orange-950 transition transform hover:scale-105">
                            <p><strong>Customer Name:</strong> {booking.customerName}</p>
                            <p><strong>Customer Address:</strong> {booking.customerAddress}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <button
                                onClick={() => setMapVisible(!mapVisible)}
                                className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                            >
                                {mapVisible ? 'Hide Map' : 'Show Map'}
                            </button>
                            {mapVisible && renderGoogleMap(booking.latitude, booking.longitude)}

                            <div className="mt-4">
                                {pendingAction.bookingId === booking.id && pendingAction.action ? (
                                    // Show confirmation buttons if an action is pending for this booking
                                    <div>
                                        <p className="mb-2">Are you sure you want to {pendingAction.action} this booking?</p>
                                        <button
                                            onClick={handleConfirmResponse}
                                            className="bg-green-500 text-white rounded px-4 py-2 mt-2 hover:bg-green-700 mr-2"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={cancelResponse}
                                            className="bg-red-500 text-white rounded px-4 py-2 mt-2 hover:bg-red-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    // Show the initial "Accept" and "Decline" buttons for pending bookings
                                    <div>
                                        <button
                                            onClick={() => handleInitiateResponse(booking.id, 'accepted')}
                                            className="bg-green-500 text-white rounded px-4 py-2 mt-2 hover:bg-green-700"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleInitiateResponse(booking.id, 'declined')}
                                            className="bg-red-500 text-white rounded px-4 py-2 mt-2 hover:bg-red-700"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                )}
                            </div>
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
                        <div key={booking.id} className="bg-yellow-100 p-4 rounded-lg   hover:bg-yellow-200 shadow-lg shadow-orange-950 transition transform hover:scale-105">
                            <p><strong>Customer Name:</strong> {booking.customerName}</p>
                            <p><strong>Customer Address:</strong> {booking.customerAddress}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <button
                                onClick={() => setMapVisible(!mapVisible)}
                                className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                            >
                                Show Map
                            </button>
                            <button
                                onClick={() => handleShowDirections(booking)}
                                className="bg-green-500 text-white rounded px-4 py-2 mt-2"
                            >
                                Show Directions
                            </button>
                            {mapVisible && renderGoogleMap(booking.latitude, booking.longitude)}
                            {selectedBooking?.id === booking.id && directionsResponse && (
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={{ lat: booking.latitude, lng: booking.longitude }}
                                    zoom={12}
                                >
                                    <DirectionsRenderer directions={directionsResponse} />
                                </GoogleMap>
                            )}

                            <div className="mt-4">
                                {ConfirmationState === booking.id ? (
                                    // If the user has clicked "Mark as Completed", show Confirm and Cancel buttons
                                    <div>
                                        <button
                                            onClick={() => confirmDone(booking.id)}
                                            className="bg-green-500 text-white rounded px-4 py-2 mr-2"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={cancelDone}
                                            className="bg-red-500 text-white rounded px-4 py-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    // Show the "Mark as Completed" button initially
                                    <button
                                        onClick={() => handleMarkAsDone(booking.id)}
                                        className="bg-yellow-500 text-white rounded px-4 py-2 mt-2"
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                            </div>
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
                        <div key={booking.id} className="bg-gray-100 p-4 rounded-lg shadow-lg shadow-orange-950">
                            <p><strong>Customer Name:</strong> {booking.customerName}</p>
                            <p><strong>Customer Address:</strong> {booking.customerAddress}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Message:</strong> {booking.message}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <p><strong>Rating:</strong> {booking.customerRating}</p>
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
                        <div key={booking.id} className="bg-gray-100 p-4 rounded-lg shadow-lg shadow-orange-950">
                            <p><strong>Customer Name:</strong> {booking.customerName}</p>
                            <p><strong>Customer Address:</strong> {booking.customerAddress}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Time:</strong> {booking.message}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <p><strong>Rating:</strong></p>
                            {booking.rating ? (
                                <StarRating rating={booking.rating} readOnly={true} />
                            ) : (
                                <p>No Rating yet !!</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Completion Confirmation Dialog */}
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6">
                        <h3 className="text-lg font-bold">Confirm Completion</h3>
                        <p>Are you sure you want to mark this booking as completed?</p>
                        <div className="mt-4">
                            <button onClick={confirmCompletion} className="bg-green-500 text-white rounded px-4 py-2">
                                Confirm
                            </button>
                            <button onClick={cancelCompletion} className="bg-red-500 text-white rounded px-4 py-2 ml-2">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default WorkerResponse;
