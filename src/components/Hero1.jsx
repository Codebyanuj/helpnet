
import React from 'react';
import bg from '../components/Icons/img2.jpg';


const Hero1 = () => {
    return (
        <div className="container-lg items-center h-screen flex justify-center bg-white">
            <div className="text-center px-4">
                <h1 className="mb-4 text-3xl font-extrabold text-[#001233] sm:text-4xl md:text-5xl lg:text-6xl 
                              hover:text-[#04aec8] transition-colors duration-300 ease-in-out">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6122a9] to-[#04aec8]">HelpNet</span> - Worker Appointment Booking.
                </h1>
                <p className="text-lg font-normal text-[#33415C] sm:text-xl lg:text-2xl 
                              hover:text-[#6122a9] transition-colors duration-300 ease-in-out">
                    Connecting the Peoples with the Local Skilled Workers
                </p>
            
            </div>
            <div className="div">
            <img src={bg} alt='background' className="h-50 w-50 mb-6" />
            </div>
        </div>
    );
};

export default Hero1;