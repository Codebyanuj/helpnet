


// import React from 'react';

// import electician from '../components/Icons/electrician.png';
// import mechanic from '../components/Icons/mechanic.png';
// import plumber from '../components/Icons/plumber.png';
// import guard from '../components/Icons/guard.png';
// import gardener from '../components/Icons/gardener.png';
// import maid from '../components/Icons/maid.png';
// import carpenter from '../components/Icons/carpenter.png';
// import contractor from '../components/Icons/contractor.png';
// import chef from '../components/Icons/chef.png';


// const GridContainer = () => {
//   const boxes = [
//     { image: electician, data: 'Eletrician' },
//     { image: mechanic, data: 'Mechanic' },
//     { image: plumber, data: 'Plumber' },
//     { image: guard, data: 'Guard' },
//     { image: gardener, data: 'Gardener' },
//     { image: maid, data: 'Maid' },
//     { image: electician, data: 'Eletrician' },
//     { image: carpenter, data: 'Carpenter' },
//     { image: contractor, data: 'Contractor' },
//     { image: chef, data: 'Chef' },
//     { image: mechanic, data: 'Mechanic' },
//     { image: plumber, data: 'Plumber' },
//     { image: electician, data: 'Eletrician' },
//     { image: mechanic, data: 'Mechanic' },
//     { image: plumber, data: 'Plumber' },
//     // Add more images and data as needed
//   ];

//   return (
//     <div className='border-t-8'>
//       <div class="text-center pt-6">
//             <h4 class="mb-4 text-1xl font-extrabold text-gray-900 dark:text-black md:text-3xl lg:text-4xl">
//                 <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-900 from-sky-700">Categories</span> of Workers.
//             </h4>
//             <p class="text-lg font-normal text-black-500 lg:text-xl dark:text-white-400">Select the Type of Worker you need.</p>
//         </div>
//     <div className="grid grid-cols-2 gap-8 p-8 md:grid-cols-3 lg:grid-cols-5">
//       {boxes.map((box, index) => (
//         <div key={index} className="bg-gray-100 p-2 py-10 h-50 w-40 flex flex-col items-center justify-center text-center rounded-lg">
//           <img src={box.image} alt={box.data} className="h-20 w-20 mb-2" />
//           <p>{box.data}</p>
//         </div>
//       ))}
//     </div>
//     </div>
//   );
// };

// export default GridContainer;

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


//Flaticon Icons
const GridContainer = () => {
  const navigate = useNavigate();

  const boxes = [
    { image: electician, data: 'electrician' },
    { image: mechanic, data: 'mechanic' },
    { image: plumber, data: 'plumber' },
    { image: guard, data: 'guard' },
    { image: gardener, data: 'gardener' },
    { image: maid, data: 'maid' },
    { image: carpenter, data: 'carpenter' },
    { image: contractor, data: 'contractor' },
    { image: chef, data: 'chef' },
    { image: coding, data: 'coding' },
    
  ];

  const handleCategoryClick = (category) => {
    navigate(`/workers/${category.toLowerCase()}`);
  };

  return (
    <div className='border-t-8'>
      <div className="text-center pt-6">
        <h4 className="mb-4 text-1xl font-extrabold text-gray-900 dark:text-black md:text-3xl lg:text-4xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-900 from-sky-700">Categories</span> of Workers.
        </h4>
        <p className="text-lg font-normal text-black-500 lg:text-xl dark:text-white-400">Select the Type of Worker you need.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 p-9 md:grid-cols-3 lg:grid-cols-5 items-center justify-items-center">
        {boxes.map((box, index) => (
          <div
            key={index}
            className="bg-gray-100 p-2 py-10 h-auto w-40 flex flex-col items-center justify-center text-center rounded-lg cursor-pointer"
            onClick={() => handleCategoryClick(box.data)}
          >
            <img src={box.image} alt={box.data} className="h-20 w-20 mb-2" />
            <p className="text-xl">{box.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridContainer;
