import React from 'react';

const CustomerSupportPage = () => {
  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Customer Support</h1>
      <p>If you have any questions or need assistance, please reach out to us!</p>
      <h2 className="text-xl font-semibold mt-6">Contact Us</h2>
      <form className="mt-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="message" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={4} required></textarea>
        </div>
        
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Submit</button>
      </form>
    </div>
  );
};

export default CustomerSupportPage;
