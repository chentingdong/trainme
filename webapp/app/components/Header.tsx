// components/Header.tsx
import React from 'react';
import Image from 'next/image';
import logo from '/public/trainmate.webp';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <div className="text-2xl font-bold flex">
          <div className="bg-blue-400 rounded-full">
            <Image src={logo} alt="TrainMate Logo" width={41} height={41} />
          </div>
          <div className='m-1'>TrainMate</div>
        </div>
        <ul className="flex space-x-4">
          <li><a href="#home" className="hover:underline">Home</a></li>
          <li><a href="#about" className="hover:underline">About</a></li>
          <li><a href="#contact" className="hover:underline">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;