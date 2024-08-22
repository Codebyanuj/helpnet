import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const CustomerBookSlot = ({ customerId, workerId }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);
    const [isSlotAvailable, setIsSlotAvailable] = useState(true);

    useEffect(() => {
        if (date && time) {
            checkSlotAvailability(date, time);
        }
    }, [date, time]);

    // Function to check if the slot is available
    const checkSlotAvailability = async (selectedDate, selectedTime) => {
        try {
            // Query to check if a booking already exists for the same worker, date, and time
            const q = query(
                collection(db, 'Bookings'),
                where('workerId', '==', workerId),
                where('date', '==', selectedDate),
                where('time', '==', selectedTime)
            );
            const querySnapshot = await getDocs(q);

            // If there's a matching document, the slot is already booked
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
            // Create a new booking document in Firestore
            await addDoc(collection(db, 'Bookings'), {
                customerId,
                workerId,
                date,
                time,
                message,
                status: 'pending',
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

                {/* Slot availability message */}
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
