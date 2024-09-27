import { intervalToDuration } from 'date-fns';
import { startOfWeek, addDays } from 'date-fns';

export const formatTimeSeconds = (seconds: number): string => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  const { hours = 0, minutes = 0, seconds: secs = 0 } = duration;

  let formattedTime = '';

  if (hours > 0) {
    formattedTime += `${hours}h:`;
  }

  if (minutes > 0 || hours > 0) {
    formattedTime += `${minutes}m:`;
  }

  formattedTime += `${secs}s`;

  return formattedTime;
};


export const getCurrentWeek = (aday?: Date): Date[] => {
  // today is as good as any.
  if (!aday) aday = new Date();
  const start = startOfWeek(aday);

  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};