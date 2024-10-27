import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook to get the category from the URL
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import CustomerBookSlot from './CustomerBookSlot'; // Import the booking component
import { getAuth } from 'firebase/auth'; // Import auth to get the current user

const WorkerList = () => {
    const { category } = useParams();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [customerId, setCustomerId] = useState(null);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const q = query(collection(db, 'Workers'), where('typeOfWork', '==', category));
                const querySnapshot = await getDocs(q);
                const workersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setWorkers(workersData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchWorkers();
    }, [category]);

    useEffect(() => {
        const fetchCustomerId = () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                setCustomerId(currentUser.uid);
            }
        };

        fetchCustomerId();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleBookNowClick = (workerId) => {
        // Toggle the selected worker: if the worker is already selected, hide the booking slot, else show it
        if (selectedWorker === workerId) {
            setSelectedWorker(null);  // Hide the booking slot
        } else {
            setSelectedWorker(workerId); // Show the booking slot for this worker
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen font-mono">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-600">
                {category.charAt(0).toUpperCase() + category.slice(1)}s Available
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {workers.map((worker) => {
                    // Handling both old and new structure of the address
                    const address = worker.address && typeof worker.address === 'object'
                        ? `${worker.address.streetAddress || ''}${worker.address.city ? ', ' + worker.address.city : ''}${worker.address.district ? ', ' + worker.address.district : ''}`
                        : worker.address || 'Address not available'; // Old structure or if no address provided

                    return (
                        <div
                            key={worker.id}
                            className="bg-white p-6 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-gray-600 hover:bg-blue-50"
                            style={{
                                transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s'
                            }}
                        >
                            <p className="font-semibold text-lg text-gray-800">{worker.name}</p>
                            <p className="text-sm text-black">Type of Work: {worker.typeOfWork}</p>
                            <p className="text-sm text-black">Address: {address}</p>
                            <p className="text-sm text-black">Email: {worker.email}</p>
                            <p className="text-sm text-black">Charges: {worker.charges}</p>

                            {/* Disable the Book Now button if the worker is busy */}
                            <button
                                className={`mt-4 py-2 px-4 rounded-lg ${
                                    !worker.availability ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-purple-600 text-white'
                                }`}
                                onClick={() => handleBookNowClick(worker.id)}
                                disabled={!worker.availability} // Disable if availability is false (busy)
                            >
                                {selectedWorker === worker.id ? 'Hide Booking' : 'Book Now'}
                            </button>

                            {selectedWorker === worker.id && worker.name && customerId && (
                                <div className="mt-4">
                                    <CustomerBookSlot customerId={customerId} workerId={worker.id} workerName={worker.name} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorkerList;
