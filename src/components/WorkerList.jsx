import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook to get the category from the URL
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import CustomerBookSlot from './CustomerBookSlot'; // Import the booking component

const WorkerList = () => {
    // Retrieve the category from the URL parameters
    const { category } = useParams();

    // State to store the list of workers
    const [workers, setWorkers] = useState([]);

    // State to manage loading status
    const [loading, setLoading] = useState(true);

    // State to handle any errors during data fetching
    const [error, setError] = useState(null);

    // State to track which worker's booking form is currently open
    const [selectedWorker, setSelectedWorker] = useState(null);

    // useEffect hook to fetch worker data from Firestore whenever the category changes
    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                // Create a query to filter workers by the type of work (category)
                const q = query(collection(db, 'Workers'), where('typeOfWork', '==', category));

                // Fetch the documents matching the query
                const querySnapshot = await getDocs(q);

                // Map the fetched documents to an array of worker data
                const workersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Update the state with the fetched workers
                setWorkers(workersData);
                setLoading(false);
            } catch (err) {
                // Handle any errors that occur during data fetching
                setError(err.message);
                setLoading(false);
                console.error("Error fetching workers data:", err);
            }
        };

        // Call the function to fetch workers
        fetchWorkers();
    }, [category]); // Re-run effect if the category in the URL changes

    // Show a loading message while the data is being fetched
    if (loading) {
        return <p>Loading...</p>;
    }

    // Show an error message if there was an error during data fetching
    if (error) {
        return <p>Error: {error}</p>;
    }

    // Function to handle the click event for the "Book Now" button
    const handleBookNowClick = (workerId) => {
        // Toggle the booking form: if the same worker is clicked again, close the form
        setSelectedWorker(workerId === selectedWorker ? null : workerId);
    };

    return (
        <div className="p-8">
            {/* Display the category title */}
            <h2 className="text-2xl font-bold mb-6">
                {category.charAt(0).toUpperCase() + category.slice(1)}s Available
            </h2>

            {/* Display a grid of worker cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Loop through the workers array and display each worker's details */}
                {workers.map((worker) => (
                    <div key={worker.id} className="bg-gray-100 p-4 rounded-lg">
                        <p className="font-bold">{worker.name}</p>
                        <p className="text-sm">Type of Work: {worker.typeOfWork}</p>
                        <p className="text-sm">Address: {worker.address}</p>
                        <p className="text-sm">Email: {worker.email}</p>

                        {/* Button to show or hide the booking form */}
                        <button 
                            className="mt-4 bg-blue-500 text-white py-1 px-3 rounded-lg"
                            onClick={() => handleBookNowClick(worker.id)}
                        >
                            {/* Toggle button text based on whether the form is open */}
                            {selectedWorker === worker.id ? 'Hide Booking' : 'Book Now'}
                        </button>

                        {/* Conditionally render the booking form if this worker is selected */}
                        {selectedWorker === worker.id && (
                            <div className="mt-4">
                                {/* Pass customerId and workerId to the booking component */}
                                <CustomerBookSlot customerId="CUSTOMER_ID" workerId={worker.id} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkerList;
