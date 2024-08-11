import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const WorkerSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [TypeOfWork, setTypeOfWork] = useState('');
    const [error, setError] = useState(null);

//     TypeOfWork: This state variable will store the type of work the user can perform (e.g., Plumbing, Electrical, etc.).
// setTypeOfWork: This function updates the TypeOfWork state variable.
// useState(''): This initializes the TypeOfWork state with an empty string

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data to Firestore
            const WorkerData = {
                name: name,
                email: email,
                address: address,
                typeOfWork: TypeOfWork
                //key :name from html
             
            };

            await setDoc(doc(db, 'Workers', user.uid), WorkerData);

            console.log("Worker's account created");

        } catch (err) {
            setError(err.message);
            console.error("Error creating Worker's account:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <form className="bg-white shadow-md rounded-lg px-14 pt-6 pb-8 mb-4 w-full max-w-sm" onSubmit={handleSubmit}>
                <h2 className="text-3xl font-bold mb-6 text-center font-mono">Worker SignIn</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

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

                <div className="mb-4">
                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                    <input
                        type="text"
                        name="address"
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your address"
                        required
                    />
                </div>

                {/* <div className="mb-4">
                    <label htmlFor="TypeOfWork" className="block text-gray-700 text-sm font-bold mb-2">Type Of Work:</label>
                    <input
                        type="text"
                        name="typeOfWork"
                        onChange={(e) => setTypeOfWork(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your type of work"
                        required
                    />
                </div> */}

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
                        <option value="guard">Painter</option>
                        <option value="gardener">Gardener</option>
                        <option value="coding">Coder</option>
                        {/* Add more options as needed */}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded">
                    Sign Up
                </button>

                <p className="mt-4 text-center text-sm">
                    Already registered?
                    <Link to='/login' className="ml-1 font-bold text-blue-500 hover:text-blue-700">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default WorkerSignup;
