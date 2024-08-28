// components/Header.tsx
import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <div className="text-2xl font-bold flex">
          <div className="bg-blue-400 rounded-full">
            <Image src="/TrainMe.webp" alt="Logo" width={41} height={41} />
          </div>
          <div className='m-1'>TrainMe</div>
        </div>
        <ul className="flex space-x-4">
          <li><a href="/calendar" className="hover:underline">Calendar</a></li>
          <li><a href="/activities" className="hover:underline">Activities</a></li>
          <li><a href="/settings" className="hover:underline">Settings</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;