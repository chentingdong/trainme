"use client";

import CalendarDay from "./CalendarDay";
import "./calendar.scss";
import Loading from "@/app/components/Loading";
import CalenderWeekHeader from "./CalendarWeekHeader";
import { getCurrentWeek } from "@/utils/timeUtils";
import { useCalendarState } from '@/app/calendar/useCalendarState';
import { trpc } from '@/app/api/trpc/client';
import { startOfWeek, endOfWeek } from 'date-fns';
import { useEffect } from 'react';

type Props = {
  aday: Date;
  showBgImage?: boolean;
};

export default function CalendarWeek({ aday, showBgImage = false }: Props) {
  const week = getCurrentWeek(aday);

  const { activities, setActivities } = useCalendarState();
  const { workouts, setWorkouts } = useCalendarState();

  const { data: weeklyData } = trpc.activities.getMany.useQuery({
    filter: {
      startDateLocal: {
        gte: startOfWeek(aday, { weekStartsOn: 1 }),
        lt: endOfWeek(aday, { weekStartsOn: 1 })
      }
    }
  });

  const { data: workoutsData } = trpc.workouts.getMany.useQuery({
    filter: {
      date: {
        gte: startOfWeek(aday, { weekStartsOn: 1 }),
        lt: endOfWeek(aday, { weekStartsOn: 1 })
      }
    }
  });

  const { mutate: upsertWorkout } = trpc.workouts.upsert.useMutation();

  useEffect(() => {
    if (weeklyData) {
      setActivities(weeklyData.activities);
    }
  }, [weeklyData, setActivities]);

  useEffect(() => {
    if (workoutsData) {
      setWorkouts(workoutsData);
    }
  }, [workoutsData, setWorkouts]);

  const handleWorkoutDrop = (workoutId: string, newDate: Date) => {
    const updatedWorkouts = workouts.map(workout =>
      workout.id === workoutId ? { ...workout, date: newDate } : workout
    );
    setWorkouts(updatedWorkouts);
    upsertWorkout({ workout: updatedWorkouts.find(workout => workout.id === workoutId) });
  };

  const backgroundImages = [
    "url(/art/20240725-Arles-7.jpg)",
    "url(/art/20240725-Arles-4.jpg)",
    "url(/art/20240725-Arles-9.jpg)",
    "url(/art/20240725-Arles-1.jpg)",
    "url(/art/20240725-Arles-5.jpg)",
    "url(/art/20240725-Arles-2.jpg)",
    "url(/art/20240725-Arles-3.jpg)",
  ];

  if (week.length === 0) return <Loading />;

  return (
    <div className="calendar-week">
      <CalenderWeekHeader aday={aday} />
      <div className="flex gap-3 justify-between p-2">
        {week.map((date, index) => {
          return (
            <div
              key={index}
              className="w-full bg-cover bg-center"
              style={
                showBgImage ? { backgroundImage: backgroundImages[index] } : {}
              }
            >
              <CalendarDay
                date={date}
                activities={activities.filter(activity => isSameDay(activity.startDateLocal, date))}
                workouts={workouts.filter(workout => isSameDay(workout.date, date))}
                onWorkoutDrop={handleWorkoutDrop}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isSameDay(date1: Date | string | null, date2: Date | string | null) {
  if (!date1 || !date2) return false;
  date1 = new Date(date1);
  date2 = new Date(date2);
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
}
