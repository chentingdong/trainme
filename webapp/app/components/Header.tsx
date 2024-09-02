'use client';

import React from 'react';
import Image from 'next/image';
import { FcSynchronize } from 'react-icons/fc';
import { fetchLatestActivities } from '../actions/activities';
import t from '@/utils/i18n';
import { Popover } from 'flowbite-react';

const Header = () => {
  const [newActivityCount, setNewActivityCount] = React.useState<number>(0);

  const syncStrava = async () => {
    try {
      const newActivities = await fetchLatestActivities(true);
      setNewActivityCount(newActivities.length);
    } catch (error) {
      console.error('Failed to sync activities:', error);
    }
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
            <Popover content={t('syncStrava')} className='popover' trigger='hover' placement='bottom'>
              <a href="#" onClick={syncStrava}>
                <FcSynchronize />
              </a>
            </Popover>
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
