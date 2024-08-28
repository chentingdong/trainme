import React from 'react';
import Header from './components/Header';

const Page = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
        <h1>TrainMe Dashboard</h1>
      </main>
    </div>
  );
};

export default Page;