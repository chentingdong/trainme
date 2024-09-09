import { intervalToDuration, formatDuration } from 'date-fns';

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