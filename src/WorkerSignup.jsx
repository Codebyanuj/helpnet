import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const WorkerSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Added state for password
    const [name, setName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');  // Updated to streetAddress
    const [city, setCity] = useState('');  // Updated to city
    const [district, setDistrict] = useState('');  // District
    const [phone, setPhone] = useState('');
    const [typeOfWork, setTypeOfWork] = useState('');
    const [charges, setCharges] = useState('');  // Charges
    const [workingDays, setWorkingDays] = useState([]); // Working days

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();


    //TO ADD FUNCTIONALITY TO SELECT THE POP-UP EMAIL
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Automatically fill in the email field with the authenticated Google email
            setEmail(user.email);

        } catch (error) {
            setError(error.message);
            console.error('Error signing in with Google:', error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Using password here
            const user = userCredential.user;

            // Save worker data to Firestore
            const workerData = {
                name: name,
                email: email,
                address: {
                    streetAddress: streetAddress.toLowerCase(),  // Updated field
                    city: city.toLowerCase(),        // Updated field
                    district: district.toLowerCase()
                },
                phone: phone,
                typeOfWork: typeOfWork,
                charges: charges, // Add charges to worker data
                workingDays: workingDays, // Add working days to worker data
                role: 'worker'
            };

            await setDoc(doc(db, 'Workers', user.uid), workerData);

            setSuccess("Worker's account created successfully!");
            navigate('/'); // Redirect to home page after successful signup

        } catch (err) {
            setError(err.message);
            console.error("Error creating Worker's account:", err);
        }
    };

    const handleWorkingDaysChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setWorkingDays([...workingDays, value]);
        } else {
            setWorkingDays(workingDays.filter(day => day !== value));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <form className="bg-white shadow-md rounded-lg px-14 pt-6 pb-8 mb-4 w-full max-w-md mt-3" onSubmit={handleSubmit}>
                <h2 className="text-3xl font-bold mb-6 text-center font-mono">Worker Sign Up</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}

                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {/* Google Sign-In Button */}
                <p>Just Select the email from your device </p>
                 <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded mb-4">
                    Sign in with Google
                </button>

                {/* Password Field */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}  // Capturing password input
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {/* Address Fields */}
                <div className="mb-4">
                    <label htmlFor="streetAddress" className="block text-gray-700 text-sm font-bold mb-2">Street Address:</label>
                    <input
                        type="text"
                        name="streetAddress"
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your street address"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City:</label>
                    <input
                        type="text"
                        name="city"
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your city"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="district" className="block text-gray-700 text-sm font-bold mb-2">District:</label>
                    <input
                        type="text"
                        name="district"
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your district"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="typeOfWork" className="block text-gray-700 text-sm font-bold mb-2">Type of Work:</label>
                    <select
                        name="typeOfWork"
                        onChange={(e) => setTypeOfWork(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        required
                    >
                        <option value="" disabled selected>Select your type of work</option>
                        <option value="electrician">Electrician</option>
                        <option value="plumber">Plumber</option>
                        <option value="mechanic">Mechanic</option>
                        <option value="carpenter">Carpenter</option>
                        <option value="chef">Chef</option>
                        <option value="maid">Maid</option>
                        <option value="guard">Guard</option>
                        <option value="mason">Mason</option>
                        <option value="coder">Coder</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
                    <input
                        type="tel"
                        name="phone"
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your Phone Number"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="charges" className="block text-gray-700 text-sm font-bold mb-2">Charges per Hour:</label>
                    <input
                        type="number"
                        name="charges"
                        onChange={(e) => setCharges(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your charges per hour"
                        required
                    />
                </div>

                {/* Working Days Selection */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Working Days:</label>
                    <div className="grid grid-cols-3 gap-2">
                        <label className="inline-flex items-center">
                            <input type="checkbox" value="Monday" onChange={handleWorkingDaysChange} />
                            <span className="ml-2">Monday</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="checkbox" value="Tuesday" onChange={handleWorkingDaysChange} />
                            <span className="ml-2">Tuesday</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="checkbox" value="Wednesday" onChange={handleWorkingDaysChange} />
                            <span className="ml-2">Wednesday</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="checkbox" value="Thursday" onChange={handleWorkingDaysChange} />
                            <span className="ml-2">Thursday</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="checkbox" value="Friday" onChange={handleWorkingDaysChange} />
                            <span className="ml-2">Friday</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="checkbox" value="Saturday" onChange={handleWorkingDaysChange} />
                            <span className="ml-2">Saturday</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="checkbox" value="Sunday" onChange={handleWorkingDaysChange} />
                            <span className="ml-2">Sunday</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200">
                        Sign Up
                    </button>
                </div>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-blue-500">Login here</Link>.
                </p>
            </form>
        </div>
    );
};

export default WorkerSignup;
