import React from 'react';
import { useNavigate } from 'react-router-dom';

import electician from '../components/Icons/electrician.png';
import mechanic from '../components/Icons/mechanic.png';
import plumber from '../components/Icons/plumber.png';
import guard from '../components/Icons/guard.png';
import gardener from '../components/Icons/gardener1.png';
import maid from '../components/Icons/maid.png';
import carpenter from '../components/Icons/carpenter.png';
import contractor from '../components/Icons/contractor.png';
import chef from '../components/Icons/chef.png';
import coding from '../components/Icons/coding.png';

const GridContainer = () => {
  const navigate = useNavigate();

  const boxes = [
    { image: electician, data: 'Electrician' },
    { image: mechanic, data: 'Mechanic' },
    { image: plumber, data: 'Plumber' },
    { image: guard, data: 'Guard' },
    { image: gardener, data: 'Gardener' },
    { image: maid, data: 'Maid' },
    { image: carpenter, data: 'Carpenter' },
    { image: contractor, data: 'Contractor' },
    { image: chef, data: 'Chef' },
    { image: coding, data: 'Coding' },
  ];


  //'workers' is collection name and it is route to it.
  const handleCategoryClick = (category) => {
    navigate(`/workers/${category.toLowerCase()}`);
  };

  return (
    <div className='border-t-8'>
      <div className="text-center pt-6">
        <h4 className="mb-4 text-xl font-extrabold text-gray-900 md:text-3xl lg:text-4xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-emerald-900">
            Categories
          </span> 
          of Workers.
        </h4>
        <p className="text-lg font-normal text-gray-700 lg:text-xl">
          Select the Type of Worker you need.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4 mx-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 items-center justify-items-center">
        {boxes.map((box, index) => (
          <div
            key={index}
            className="bg-gray-200 p-4 h-auto w-full sm:w-40 md:w-44 flex flex-col items-center justify-center text-center rounded-lg cursor-pointer hover:bg-gray-300 transition duration-300"
            onClick={() => handleCategoryClick(box.data)}
          >
            <img src={box.image} alt={`${box.data} icon`} className="h-30 w-20 mb-4" />
            <p className="text-lg sm:text-xl">{box.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridContainer;
