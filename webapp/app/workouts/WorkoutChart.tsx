"use client";

import React, { useRef } from 'react';
import type { workout as Workout } from '@prisma/client';
import ConnectedHistogram from '../components/Histogram';

type Props = {
  workout: Workout;
};

export default function WorkoutChart({ workout }: Props) {
  const pace = 6; // 6 minutes per km
  const chartRef = useRef<HTMLDivElement>(null);

  // Helper function to extract time and zone
  const parseWorkoutData = (workout: string | null) => {
    if (!workout) return [];
    const data = JSON.parse(workout);
    let duration = 0.0, time = 0.0;
    let zone = 0;
    let result: { time: number, zone: number; }[] = [];
    result.push({ time, zone });
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const timeMatch = item.match(/(\d+(\.\d+)?)m/); // Matches time in minutes
      const distanceMatch = item.match(/(\d+(\.\d+)?)km/); // Matches distance in km
      const zoneMatch = item.match(/Z(\d+)/); // Matches zone (Z1, Z2, etc.)

      if (timeMatch) {
        duration = parseFloat(timeMatch[1]);
      } else if (distanceMatch) {
        duration = parseFloat(distanceMatch[1]) * pace;
      }
      zone = zoneMatch ? parseInt(zoneMatch[1]) : 1;
      duration = Math.round(duration); // Round to 1 decimal place
      result.push({ time, zone });
      time += duration;
    };
    result.push({ time, zone });
    return result;
  };

  const chartData = parseWorkoutData(workout.workout);
  return <ConnectedHistogram chartData={chartData} chartRef={chartRef} height={200} />;
}