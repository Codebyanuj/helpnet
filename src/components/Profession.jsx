import React from 'react'

const Profession = () => {

    return (
        <div className='flex items-center justify-center min-h-screen bg-white'>
            <div className='border-2 border-gray-600 rounded-lg shadow-lg p-6 bg-gray-300'>
                <h1 className='text-black font-bold text-center mb-4'>Select the Type of your SignIn</h1>
                <div className='flex justify-center space-x-7'>
                    <button type="button" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-7 py-2.5 text-center mb-2"><a href='SignUp'>Customer</a></button>
                    <button type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-7 py-2.5 text-center mb-2"><a href='WorkerSignin'>Worker</a></button>
                </div>
            </div>
        </div>
    );
};



export default Profession;
