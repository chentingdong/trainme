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
    <div className='relative w-full h-full p-4 flex flex-col gap-4 justify-between'>
      <Carousel
        className='relative h-128'
        slide={false}
        indicators={false}
        leftControl={<FaChevronLeft className='btn btn-icon absolute top-2 left-2' onClick={handlePrevWeek} />}
        rightControl={<FaChevronRight className='btn btn-icon absolute top-2 right-2' onClick={handleNextWeek} />}
      >
        <div className='h-full flex items-center justify-center'>
          <CalendarWeek aday={aday} />
        </div>
      </Carousel>
      <WorkoutEditor />
    </div>
  );
}
