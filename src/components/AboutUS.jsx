import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto p-6 space-y-8 bg">
      <div className="bg-purple-200 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">About Us</h2>
        <p className="text-gray-700 text-lg">
          Welcome to Helpnet, where we believe in the power of connection. Our mission is to bridge the gap between those in need and skilled local workers who can provide solutions. At Helpnet, we understand that finding the right help should be easy, fast, and reliable—so we’ve made it our goal to create a platform that brings people together, right when they need it most.
        </p>
      </div>

      <div className="bg-purple-200 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 text-lg">
          We aim to empower individuals by providing them with a platform that connects them with trusted professionals in their area. Our mission is to simplify the process of finding help, ensuring that every request is met with quality service. We believe in the strength of local communities, and through Helpnet, we’re fostering connections that make a difference.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-200 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Helpnet?</h2>
          <ul className="list-disc list-inside text-gray-700 text-lg">
            <li>Reliable Connections: We vet our professionals to ensure that you’re connected with trustworthy, skilled workers.</li>
            <li>User-Friendly Platform: Our intuitive interface makes it easy to find, book, and manage services.</li>
            <li>Community-Driven: We’re focused on building strong local communities by connecting people with the resources they need.</li>
          </ul>
        </div>

        <div className="bg-purple-200 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Join the Helpnet Community</h2>
          <p className="text-gray-700 text-lg">
            We invite you to become part of the Helpnet community—whether you’re looking for help or offering your skills. Together, we can build a network that supports and uplifts everyone. Sign up today and discover how Helpnet can make your life easier.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
