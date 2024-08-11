import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const WorkerList = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                // Reference to the 'Workers' collection
                const querySnapshot = await getDocs(collection(db, 'Workers'));

                // Map the results to an array of worker data
                const workersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setWorkers(workersData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error("Error fetching workers data:", err);
            }
        };

        fetchWorkers();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Available Workers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {workers.map((worker) => (
                    <div key={worker.id} className="bg-gray-100 p-4 rounded-lg">
                        <p className="font-bold">{worker.name}</p>
                        <p className="text-sm">Type of Work: {worker.typeOfWork}</p>
                        <p className="text-sm">Address: {worker.address}</p>
                        <p className="text-sm">Email: {worker.email}</p>
                        <button className="mt-4 bg-blue-500 text-white py-1 px-3 rounded-lg">Book Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkerList;
