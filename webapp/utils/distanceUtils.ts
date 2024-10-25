export const formatDistance = (meters: number): string => {
  return `${Math.floor(meters / 16) / 100}`;
};

export const workoutTotalDistance = (steps: string[]): number => {
  const pace = 6; // 6 minutes per km
  let totalDistance = 0;
  for (const step of steps) {
    const distanceMatch = step.match(/(\d+(\.\d+)?)km/);
    const durationMatch = step.match(/(\d+(\.\d+)?)m/);

    if (distanceMatch) {
      totalDistance += parseFloat(distanceMatch[1]);
    } else if (durationMatch) {
      totalDistance += parseFloat(durationMatch[1]) / pace;
    }
  }
  totalDistance = Math.round(totalDistance * 100) / 100;
  return totalDistance;
};

export const workoutTotalDuration = (steps: string[]): number => {
  // TODO: get this from average pace from db.
  const pace = 6; // 6 minutes per km

  let totalDuration = 0;
  for (const step of steps) {
    const distanceMatch = step.match(/(\d+(\.\d+)?)km/);
    const durationMatch = step.match(/(\d+(\.\d+)?)m/);
    if (durationMatch) {
      totalDuration += parseFloat(durationMatch[1]);
    } else if (distanceMatch) {
      totalDuration += parseFloat(distanceMatch[1]) * pace;
    }
  }
  return totalDuration;
};
