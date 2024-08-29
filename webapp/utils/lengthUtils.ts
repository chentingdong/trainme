export const formatDistance = (meters: number): string => {
  return `${Math.floor(meters / 16) / 100} miles`;
};