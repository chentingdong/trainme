"use client";

import React, { useState } from 'react';
import WorkoutEditor from './WorkoutEditor';
import WorkoutList from './WorkoutList';
import type { workout as Workout } from '@prisma/client';

type Props = {};

export default function page({ }: Props) {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>();
  return (
    <div className="flex flex-col justify-between h-full">
      <WorkoutEditor workout={selectedWorkout} />
      <WorkoutList setSelectedWorkout={setSelectedWorkout} />
    </div>
  );
}