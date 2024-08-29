import React from 'react';
import TrainingCalendar from './TrainingCalendar';

const Page = () => {
  return (
    <div className="flex-grow flex flex-col p-4 bg-gradient-to-b from-gray-100 to-gray-300">
      <TrainingCalendar />
    </div>
  );
};

export default Page;