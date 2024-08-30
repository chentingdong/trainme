export const formatTimeSeconds = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h:${m}m:${s}s`;
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};

export const formatTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString();
};