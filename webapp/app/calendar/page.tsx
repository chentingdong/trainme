'use client';

import React from 'react';
import CalendarWeek from './CalendarWeek';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Carousel } from 'flowbite-react';
import CalendarMonth from './CalendarMonth';

type Props = {};

export default function page({ }: Props) {
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
    <div className='relative h-128 w-full p-4'>
      {/* <CalendarMonth /> */}
      <Carousel
        className='h-full'
        slide={false}
        leftControl={<FaChevronLeft className='btn btn-icon w-8 h-8 absolute top-4 left-4' onClick={handlePrevWeek} />}
        rightControl={<FaChevronRight className='btn btn-icon w-8 h-8 absolute top-4 right-4' onClick={handleNextWeek} />}
      >
        <div className='h-full flex items-center justify-center'>
          <CalendarWeek aday={aday} />
        </div>
      </Carousel>
    </div>
  );
}
