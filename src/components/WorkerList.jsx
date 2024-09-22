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
        setSelectedWorker(workerId === selectedWorker ? null : workerId);
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen font-mono">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-600">
                {category.charAt(0).toUpperCase() + category.slice(1)}s Available
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {workers.map((worker) => (
                    <div
                        key={worker.id}
                        className="bg-white p-6 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-gray-600 hover:bg-blue-50"
                        style={{
                            transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s'
                        }}
                    >
                        <p className="font-semibold text-lg text-gray-800">{worker.name}</p>
                        <p className="text-sm text-black">Type of Work: {worker.typeOfWork}</p>
                        <p className="text-sm text-black">Address: {worker.address}</p>
                        <p className="text-sm text-black">Email: {worker.email}</p>
                        <p className="text-sm text-black">Charges: {worker.charges}</p>

                        <button
                            className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-purple-600"
                            onClick={() => handleBookNowClick(worker.id)}
                        >
                            {selectedWorker === worker.id ? 'Hide Booking' : 'Book Now'}
                        </button>

                        {selectedWorker === worker.id && worker.name && customerId && (
                            <div className="mt-4">
                                <CustomerBookSlot customerId={customerId} workerId={worker.id} workerName={worker.name} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkerList;
