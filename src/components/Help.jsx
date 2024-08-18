import React from 'react';

const Help = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="bg-lime-300 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">How Helpnet Works</h2>
        <p className="text-gray-700">
          Helpnet is designed to make connecting with local professionals simple and efficient. Here’s how it works:
        </p>
        <ol className="list-decimal list-inside text-gray-700 mt-4 space-y-2">
          <li>
            <strong>Sign Up:</strong> Create a free account on Helpnet to get started.
          </li>
          <li>
            <strong>Find a Professional:</strong> Browse our network of skilled workers to find the right person for your needs.
          </li>
          <li>
            <strong>Send a Request:</strong> Contact the professional directly through the platform to discuss your requirements.
          </li>
          <li>
            <strong>Booking Confirmation:</strong> Once the professional accepts your request, your booking is confirmed.
          </li>
          <li>
            <strong>Work Completed:</strong> After the job is done, the professional will mark it as completed.
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-200 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="text-gray-700">
            If you have any questions or need assistance, our support team is here to help. Whether you’re having trouble finding a professional or need help with your account, don’t hesitate to reach out.
          </p>
          <p className="text-gray-700 mt-4">
            You can contact us via email at [support email] or visit our FAQ section for quick answers to common questions.
          </p>
        </div>

        <div className="bg-purple-200 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Becoming a Helpnet Professional</h2>
          <p className="text-gray-700">
            Are you a skilled worker looking to offer your services? Join the Helpnet community as a professional. By signing up, you’ll be able to connect with customers in your area who need your expertise.
          </p>
          <p className="text-gray-700 mt-4">
            To get started, create a professional profile on Helpnet and start receiving job requests from customers today!
          </p>
        </div>
      </div>
      <div className="bg-gray-100 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Customer Care</h2>
        <p className="text-gray-700 text-lg">
          Our customer care team is dedicated to ensuring you have the best experience possible with Helpnet. If you need any assistance, please don't hesitate to reach out.
        </p>
        <p className="text-gray-700 mt-4">
          <strong>Contact Information:</strong>
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
          <li>Email: support@helpnet.com</li>
          <li>Phone: +1 234 567 890</li>
          <li>Live Chat: Available 24/7 through our website</li>
        </ul>
        <p className="text-gray-700 mt-4">
          We're here to help with anything from account issues to questions about finding the right professional for your needs. Your satisfaction is our top priority.
        </p>
      </div>
    </div>
  );
};

export default Help;
