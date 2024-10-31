'use client';

import React, { useState } from 'react';
import CalendarWeek from './CalendarWeek';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import WorkoutEditor from '../workouts/WorkoutEditor';
import { ChatWindow } from '@/app/chat/ChatWindow';
import Placeholder from '@/app/components/Placeholder';
import Image from 'next/image';
const imageUrl = '/api/chat/coach/graph';

const showImage = false;

export default function Page() {
  const [aday, setAday] = useState<Date>(new Date());

  const handlePrevWeek = () => {
    const prevWeek = new Date(aday!);
    prevWeek.setDate(aday!.getDate() - 7);
    setAday(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(aday!);
    nextWeek.setDate(aday!.getDate() + 7);
    setAday(nextWeek);
  };

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <div className='relative'>
        <FaChevronLeft
          className='btn btn-icon absolute z-10 w-6 h-6 top-2 left-2'
          onClick={handlePrevWeek}
        />
        <FaChevronRight
          className='btn btn-icon absolute z-10 w-6 h-6 top-2 right-2'
          onClick={handleNextWeek}
        />
        <CalendarWeek aday={aday} />
      </div>
      <div
        className='flex-grow overflow-auto grid grid-cols-12 gap-4 p-4 bg-slate-100 dark:bg-black opacity-85'
        style={
          showImage
            ? { backgroundImage: `url('/art/20240811-act-goats.jpg')` }
            : undefined
        }
      >
        <div className='col-span-6 flex flex-col justify-end gap-4 bg-center bg-cover h-full'>
          <WorkoutEditor />
        </div>
        <div className='col-span-6 h-full'>
          <div className='h-full overflow-y-auto bg-contain'
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: '40%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <ChatWindow
              endpoint='api/chat/coach'
              titleText='Virtual Coach'
              placeholder="I'm your virtual coach! I can help you plan your workouts!"
              emptyStateComponent={<Placeholder />}
              showIntermediateStepsToggle={true}
              showIngestForm={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
