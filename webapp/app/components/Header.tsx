// components/Header.tsx
import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-2">
      <nav className="flex justify-between items-center">
        <div className="text-xl font-normal flex space-x-4">
          <div className="bg-blue-500 rounded-full">
            <Image src="/TrainMe.webp" alt="Logo" width={32} height={32} />
          </div>
          <div className='text-blue-100'>TrainMe</div>
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