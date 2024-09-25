'use client';

import React from 'react';
import CalendarWeek from './CalendarWeek';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Carousel } from 'flowbite-react';
import WorkoutEditor from '../workouts/WorkoutEditor';

type Props = {};

export default function Page({ }: Props) {
  const [aday, setAday] = React.useState<Date>(new Date());

  const handlePrevWeek = () => {
    let prevWeek = new Date(aday!);
    prevWeek.setDate(aday!.getDate() - 7);
    setAday(prevWeek);
  };

  const handleNextWeek = () => {
    let nextWeek = new Date(aday!);
    nextWeek.setDate(aday!.getDate() + 7);
    setAday(nextWeek);
  };

  return (
    <div className='gap-0 w-full h-full p-4 dark:text-white flex flex-col justify-between'>
      <Carousel
        className='relative w-full h-104 flex-grow-0'
        slide={false}
        indicators={false}
        leftControl={<FaChevronLeft className='btn btn-icon absolute w-6 h-6 top-2 left-2' onClick={handlePrevWeek} />}
        rightControl={<FaChevronRight className='btn btn-icon absolute w-6 h-6 top-2 right-2' onClick={handleNextWeek} />}
      >
        <CalendarWeek aday={aday} />
      </Carousel>
      <div className='overflow-auto flex-grow'
        style={{ backgroundImage: `url('/art/20240811-act-goats.jpg')` }}>
        <WorkoutEditor />
      </div>
    </div>
  );
}
