import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const WorkerList = () => {
  const { category } = useParams();
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    // Mocked fetching data based on category
    // Replace this with an actual API call or Firestore query
    const fetchWorkers = async () => {
      const data = [
        { name: 'John Doe', category: 'electrician' },
        { name: 'Jane Smith', category: 'electrician' },
        { name: 'Bob Brown', category: 'mechanic' },
        { name: 'Alice Green', category: 'mechanic' },
        { name: 'Anuj Sawant', category: 'coding' },
        { name: 'Sandeep Singh', category: 'coding' },
        // Add more workers here
      ];
      const filteredWorkers = data.filter(worker => worker.category === category);
      setWorkers(filteredWorkers);
    };

    fetchWorkers();
  }, [category]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">{category.charAt(0).toUpperCase() + category.slice(1)}s</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workers.map((worker, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg">
            <p className="font-bold">{worker.name}</p>
            <p className="text-sm">{worker.category.charAt(0).toUpperCase() + worker.category.slice(1)}</p>
            <button className="mt-4 bg-blue-500 text-white py-1 px-3 rounded-lg">Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkerList;
