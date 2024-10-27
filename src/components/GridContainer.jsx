import React from 'react';
import { useNavigate } from 'react-router-dom';

import electician from '../components/Icons/electrician.png';
import mechanic from '../components/Icons/mechanic.png';
import plumber from '../components/Icons/plumber.png';
import guard from '../components/Icons/guard.png';
import gardener from '../components/Icons/gardener.png';
import maid from '../components/Icons/maid.png';
import carpenter from '../components/Icons/carpenter.png';
import contractor from '../components/Icons/contractor.png';
import chef from '../components/Icons/chef.png';
import painter from '../components/Icons/painter.png';

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
    { image: painter, data: 'Painter' },
  ];


  //'workers' is collection name and it is route to it.
  const handleCategoryClick = (category) => {
    navigate(`/workers/${category.toLowerCase()}`);
  };

  return (
    <div className="border-t-8 font-mono px-5 ">
      <div className="text-center pt-6 mb-10">
        <h4 className="mb-4 py-3 text-2xl font-extrabold font-serifs rounded-lg shadow-lg shadow-yellow-950 text-gray-900 md:text-3xl lg:text-4xl  bg-gradient-to-r from-blue-300 to-purple-300">
          <span className="text-transparent  bg-clip-text bg-gradient-to-r from-purple-700 to-emerald-900">
          Categories_
          </span> 
             of Workers.
        </h4>
        <p className="text-lg font-semibold text-black lg:text-xl">
          Select the Type of Worker you need.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 p-5  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 items-center justify-items-center ">
        {boxes.map((box, index) => (
          <div
            key={index}
            className="bg-gray-200 px-4 py-11 h-auto mb-4 w-full sm:w-40 md:w-44 flex flex-col items-center shadow-md shadow-yellow-950 justify-center text-center rounded-lg cursor-pointer ursor-pointer hover:bg-gradient-to-b from-indigo-500 to-purple-500  transition duration-300 transform hover:scale-125 hover:shadow-lg "
            onClick={() => handleCategoryClick(box.data)}
          >
            <img src={box.image} alt={`${box.data} icon`} className="h-22 w-20 mb-6" />
            <p className="text-lg font-semibold sm:text-xl">{box.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridContainer;
