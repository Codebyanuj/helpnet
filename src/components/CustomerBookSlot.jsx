import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const CustomerBookSlot = ({ customerId, workerId }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);
    const [isSlotAvailable, setIsSlotAvailable] = useState(true);
    const [location, setLocation] = useState({ latitude: null, longitude: null });
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
                    setLocation({
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

        try {
            await addDoc(collection(db, 'Bookings'), {
                customerId,
                workerId,
                date,
                time,
                message,
                status: 'pending',
                latitude: location.latitude,
                longitude: location.longitude,
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
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Book a Slot</h3>

            {status && (
                <p className={`text-sm ${status.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {status}
                </p>
            )}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Select Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Select Time
                    </label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {!isSlotAvailable && (
                    <p className="text-red-500 text-sm mb-4">This slot is already booked. Please choose another time.</p>
                )}

                <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message (Optional)
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="3"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    disabled={!isSlotAvailable}
                >
                    Submit Booking
                </button>
            </form>
        </div>
    );
};

export default CustomerBookSlot;
