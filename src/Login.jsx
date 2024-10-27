import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [resetEmail, setResetEmail] = useState('');  // For password reset
    const [isReset, setIsReset] = useState(false);  // To toggle between normal login and reset
    const [showModal, setShowModal] = useState(false);  // To show password reset modal
    const navigate = useNavigate();  // Initialize useNavigate

    // Sign-in Function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            setSuccess("Login successful!");
            navigate('/');  // Redirect to home page on successful login

        } catch (err) {
            setError(err.message);
            console.error("Error signing in:", err);
        }
    };

    // Forgot Password Function
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setSuccess("Password reset email sent!");
            setShowModal(false);  // Close modal after sending reset email

        } catch (err) {
            setError(err.message);
            console.error("Error sending password reset email:", err);
        }
    };

    // Toggle modal for password reset
    const toggleModal = () => {
        setShowModal(!showModal);
        setIsReset(false);  // Ensure we're in login mode when modal closes
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <form className="bg-white shadow-md rounded-lg px-14 pt-6 pb-8 mb-4 w-full max-w-sm" onSubmit={handleSubmit}>
                <h2 className="text-3xl font-bold mb-6 text-center font-mono">Login</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}

                {/* Email Field */}
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

                {/* Password Field */}
                {!isReset && (
                    <div className="mb-4">
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
                )}

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded">
                    Login
                </button>

                {/* Forgot Password Link */}
                {!isReset ? (
                    <p className="mt-4 text-center text-sm">
                        Forgot your password? 
                        <span 
                            className="ml-1 font-bold text-blue-500 cursor-pointer hover:text-blue-700" 
                            onClick={toggleModal}  // Show modal
                        >
                            Reset it
                        </span>
                    </p>
                ) : (
                    <p className="mt-4 text-center text-sm">
                        Back to login? 
                        <span 
                            className="ml-1 font-bold text-blue-500 cursor-pointer hover:text-blue-700" 
                            onClick={() => setIsReset(false)}
                        >
                            Go back
                        </span>
                    </p>
                )}

                <p className="mt-4 text-center text-sm">
                    Don't have an account? 
                    <Link to='/signupas' className="ml-1 font-bold text-blue-500 hover:text-blue-700">Sign Up</Link>
                </p>
            </form>

            {/* Password Reset Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

                        {error && <p className="text-red-500 text-center">{error}</p>}
                        {success && <p className="text-green-500 text-center">{success}</p>}

                        {/* Reset Email Input */}
                        <div className="mb-4">
                            <label htmlFor="resetEmail" className="block text-gray-700 text-sm font-bold mb-2">Enter your email:</label>
                            <input
                                type="email"
                                name="resetEmail"
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded border-gray-300"
                                placeholder="Enter your email to reset password"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button onClick={handleResetPassword} className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded">
                            Send Reset Email
                        </button>

                        {/* Close Modal Button */}
                        <button onClick={toggleModal} className="mt-2 w-full bg-gray-500 hover:bg-gray-700 text-white py-2 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginForm;
