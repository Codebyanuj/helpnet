import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [streetOrVillage, setStreetOrVillage] = useState('');
    const [cityOrTaluka, setCityOrTaluka] = useState('');
    const [district, setDistrict] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data to Firestore
            const customerData = {
                name: name,
                email: email,
                address: {
                    streetOrVillage: streetOrVillage.toLowerCase(),
                    cityOrTaluka: cityOrTaluka.toLowerCase(),
                    district: district.toLowerCase()
                },
                role: 'customer'
            };

            await setDoc(doc(db, 'customers', user.uid), customerData);

            setSuccess("Customer account created successfully!");
            navigate('/');

        } catch (err) {
            setError(err.message);
            console.error("Error creating customer account:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100">
            <form className="bg-white shadow-lg rounded-xl px-10 pt-8 pb-6 mb-4 w-full max-w-md transform transition-all duration-500 hover:shadow-2xl hover:scale-105">
                <h2 className="text-3xl font-extrabold font-mono text-center text-black mb-8">Customer Sign Up</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}

                <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email:</label>
                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}  // Bind the email state
                        className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <p className="text-gray-600 text-sm mb-4">Or select your Google email below</p>
                <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold mb-6 transition duration-300"
                >
                    Sign in with Google
                </button>

                <div className="mb-6">
                    <label htmlFor="streetOrVillage" className="block text-gray-700 text-sm font-semibold mb-2">Street or Village:</label>
                    <input
                        type="text"
                        name="streetOrVillage"
                        onChange={(e) => setStreetOrVillage(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        placeholder="Enter your street or village"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="cityOrTaluka" className="block text-gray-700 text-sm font-semibold mb-2">City or Taluka:</label>
                    <input
                        type="text"
                        name="cityOrTaluka"
                        onChange={(e) => setCityOrTaluka(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        placeholder="Enter your city or taluka"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="district" className="block text-gray-700 text-sm font-semibold mb-2">District:</label>
                    <input
                        type="text"
                        name="district"
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        placeholder="Enter your district"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password:</label>
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold transition duration-300"
                >
                    Sign Up
                </button>

                <p className="mt-4 text-center text-gray-600 text-sm">
                    Already registered? 
                    <Link to='/login' className="ml-1 font-semibold text-indigo-500 hover:text-indigo-700 transition duration-300">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default SignUpForm;
