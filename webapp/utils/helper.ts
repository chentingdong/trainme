import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const getZoneColor = (zone: number) => {
  let fill = '#8884d8';
  switch (zone) {
    case 1:
      fill = '#8884d8';
      break;
    case 2:
      fill = '#82ca9d';
      break;
    case 3:
      fill = '#ffc658';
      break;
    case 4:
      fill = '#ff7300';
      break;
  };
  return fill;
};

// not very useful, I'd do `h-full` + ${className} instead.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}