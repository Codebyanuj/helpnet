import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook to get the category from the URL
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import CustomerBookSlot from './CustomerBookSlot'; // Import the booking component
import { getAuth } from 'firebase/auth'; // Import auth to get the current user

const WorkerList = () => {
    const { category } = useParams();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [customerCity, setCustomerCity] = useState(null); // State to hold customer's city

    useEffect(() => {
        const fetchCustomerCity = async (uid) => {
            try {
                const docRef = doc(db, 'customers', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Access cityOrTaluka from within the address subfield
                    const customerData = docSnap.data();
                    const customerCity = customerData?.address?.cityOrTaluka; // Use optional chaining to avoid errors if address is missing

                    if (customerCity) {
                        setCustomerCity(customerCity.toLowerCase()); // Assuming you want to store it in lowercase
                    } else {
                        console.error('City or Taluka not found in the customer data.');
                    }
                } else {
                    console.error('No such document for customer!');
                }
            } catch (err) {
                console.error('Error fetching customer city:', err);
                setError(err.message);
            }
        };


        const fetchCustomerId = () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                setCustomerId(currentUser.uid);
                fetchCustomerCity(currentUser.uid); // Fetch customer's city after getting their ID
            }
        };

        fetchCustomerId();
    }, []);

    useEffect(() => {
        const fetchWorkers = async () => {
            if (!customerCity) return; // Wait until customerCity is fetched

            try {
                // Modify the query to access the city subfield in the Workers collection
                const q = query(
                    collection(db, 'Workers'),
                    where('typeOfWork', '==', category),
                    where('address.city', '==', customerCity) // Match the worker's city (subfield) with the customer's city
                );

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
    }, [category, customerCity]);

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
                {category.charAt(0).toUpperCase() + category.slice(1)}s Available in {customerCity}
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

                        {/* Access and display individual properties of the address */}
                        <p className="text-sm text-black">Street: {worker.address.streetAddress}</p>
                        <p className="text-sm text-black">City: {worker.address.city}</p>
                        <p className="text-sm text-black">District: {worker.address.district}</p>

                        <p className="text-sm text-black">Email: {worker.email}</p>
                        <p className="text-sm text-black">Charges: {worker.charges}</p>

                        {/* Disable the Book Now button if the worker is busy */}
                        <button
                            className={`mt-4 py-2 px-4 rounded-lg ${!worker.availability ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-purple-600 text-white'
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
                ))}
            </div>
        </div>
    );
};

export default WorkerList;
