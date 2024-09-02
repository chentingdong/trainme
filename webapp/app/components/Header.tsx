'use client';

import React from 'react';
import Image from 'next/image';
import { FcSynchronize } from 'react-icons/fc';
import { fetchLatestActivities } from '../actions/activities';

const Header = () => {
  const [newActivityCount, setNewActivityCount] = React.useState<number>(0);

  const syncStrava = async () => {
    const newActivities = await fetchLatestActivities(true);
    setNewActivityCount(newActivities.length);
  };

  return (
    <header className='bg-gray-800 text-white p-2'>
      <nav className='flex justify-between items-center'>
        <a href='/' className='text-xl font-normal flex space-x-4'>
          <div className='bg-blue-500 rounded-full'>
            <Image src='/TrainMe.webp' alt='Logo' width={32} height={32} />
          </div>
          <div className='text-blue-100'>TrainMe</div>
        </a>
        <ul className='flex space-x-4 items-center'>
          <li>
            <FcSynchronize onClick={syncStrava} className='cursor-pointer' />
          </li>
          <li>
            <a href='/calendar' className='hover:underline'>
              Calendar
            </a>
          </li>
          <li className='relative flex gap-1 items-center'>
            <a href='/activities' className='hover:underline'>
              Activities
            </a>
            <span className='circle small bg-green-700'>
              {newActivityCount}
            </span>
          </li>
          <li>
            <a href='/settings' className='hover:underline'>
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
