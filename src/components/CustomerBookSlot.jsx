import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

const CustomerBookSlot = ({ customerId, workerId }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);
    const [isSlotAvailable, setIsSlotAvailable] = useState(true);
    const [customerLocation, setCustomerLocation] = useState({ latitude: null, longitude: null });
    const [taskLocation, setTaskLocation] = useState({ latitude: null, longitude: null });
    const [workerLocation, setWorkerLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (date && time) {
            checkSlotAvailability(date, time);
        }
    }, [date, time]);

    useEffect(() => {
        // Fetch the customer's location when the component mounts
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCustomerLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        // Fetch and update worker's real-time location
        const updateWorkerLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(
                    async (position) => {
                        const currentLocation = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                        setWorkerLocation(currentLocation);

                        // Update the worker's location in the Workers collection
                        const workerRef = doc(db, 'Workers', workerId);
                        await updateDoc(workerRef, {
                            location: currentLocation,
                            timestamp: serverTimestamp(),
                        });
                    },
                    (error) => {
                        setError(error.message);
                    }
                );
            }
        };

        updateWorkerLocation();
    }, [workerId]);

    // Function to check if the slot is available
    const checkSlotAvailability = async (selectedDate, selectedTime) => {
        try {
            const q = query(
                collection(db, 'Bookings'),
                where('workerId', '==', workerId),
                where('date', '==', selectedDate),
                where('time', '==', selectedTime)
            );
            const querySnapshot = await getDocs(q);
            setIsSlotAvailable(querySnapshot.empty);
        } catch (error) {
            console.error('Error checking slot availability:', error);
            setIsSlotAvailable(false);
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isSlotAvailable) {
            setStatus('This slot is already booked. Please choose another.');
            return;
        }

        // Use the customer-provided task location, or default to their current location
        const finalTaskLocation = taskLocation.latitude && taskLocation.longitude ? taskLocation : customerLocation;

        try {
            await addDoc(collection(db, 'Bookings'), {
                customerId,
                workerId,
                date,
                time,
                message,
                status: 'pending',
                taskLocation: finalTaskLocation,
                workerLocation,
                timestamp: serverTimestamp(),
            });

            setStatus('Booking request sent successfully!');
            setDate('');
            setTime('');
            setMessage('');
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="bg-gradient-to-b from-blue-100 to-purple-200 p-6 border-gray-600 border-4 rounded-xl shadow-xl max-w-lg mx-auto">
            <h3 className="text-2xl font-extrabold mb-6 text-blue-700">Book a Slot</h3>

            {status && (
                <p className={`text-sm ${status.includes('Error') ? 'text-red-500' : 'text-green-500'} mb-4`}>
                    {status}
                </p>
            )}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <label htmlFor="date" className="block text-sm font-semibold text-gray-700">
                        Select Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-transform transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="relative">
                    <label htmlFor="time" className="block text-sm font-semibold text-gray-700">
                        Select Time
                    </label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-transform transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="relative">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                        Message (Optional)
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-transform transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                        rows="3"
                    />
                </div>

                <div className="relative">
                    <label htmlFor="taskLocation" className="block text-sm font-semibold text-gray-700">
                        Task Location (Optional)
                    </label>
                    <input
                        type="text"
                        placeholder="Latitude"
                        value={taskLocation.latitude || ''}
                        onChange={(e) => setTaskLocation({ ...taskLocation, latitude: e.target.value })}
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-transform transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Longitude"
                        value={taskLocation.longitude || ''}
                        onChange={(e) => setTaskLocation({ ...taskLocation, longitude: e.target.value })}
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-transform transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 focus:outline-none"
                    disabled={!isSlotAvailable}
                >
                    Submit Booking
                </button>
            </form>
        </div>
    );
};

export default CustomerBookSlot;
