import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // State variable for the message
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear any existing messages
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage('Login Successful');
            navigate('/'); // Redirect to the home page or another protected route
        } catch (err) {
            setMessage('Error logging in: ' + err.message); // Set the error message
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-300">
            <form className="bg-white shadow-md rounded-lg px-14 pt-6 pb-8 mb-4 w-full max-w-sm border-black" onSubmit={handleSubmit}>
                <h2 className="text-3xl font-bold mb-6 text-center font-mono">Login</h2>

                <div className="mb-4">
                    <label htmlFor='email' className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor='password' className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-gray-300"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button type='submit' className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded">
                    Login
                </button>

                {message && (
                    <p className={`mt-4 text-center text-sm ${message.includes('Successful') ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}

                <p className="mt-4 text-center text-sm">
                    Don't have an account?
                    <Link to='/signup' className="ml-1 font-bold text-blue-500 hover:text-blue-700">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
