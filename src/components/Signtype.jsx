import React from 'react';

const Profession = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200">
            <div className="border-2 border-gray-200 rounded-2xl shadow-xl p-8 bg-white transform transition duration-500 hover:scale-105">
                <h1 className="text-gray-800 font-extrabold text-2xl text-center mb-6">
                    Choose Your Sign-In Type
                </h1>
                <div className="flex justify-center space-x-7">
                    <button
                        type="button"
                        className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-semibold rounded-lg text-lg px-8 py-3 transition duration-300 transform hover:scale-105"
                    >
                        <a href="Signin">Customer</a>
                    </button>
                    <button
                        type="button"
                        className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-semibold rounded-lg text-lg px-8 py-3 transition duration-300 transform hover:scale-105"
                    >
                        <a href="WorkerSignin">Worker</a>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profession;
