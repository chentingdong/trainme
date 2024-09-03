import React from 'react';
import { getActivityLaps } from '@/app/actions/laps';
import Debug from '../components/Debug';

type Props = {
  activityId: number;
};

type Lap = {
  id: number;
  activity_id: number;
  name: string;
  elapsed_time: number;
  moving_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  average_speed: number;
  max_speed: number;
  average_cadence: number;
  max_cadence: number;
  average_heartrate: number;
  max_heartrate: number;
  lap_index: number;
};

export default function ActivityLaps({ activityId }: Props) {
  const [laps, setLaps] = React.useState<Lap[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    getActivityLaps(activityId)
      .then((laps) => {
        setLaps(laps);
        setLoading(false);
      });
  }, [activityId]);

  return (
    <div><Debug data={laps} /></div>
  );
}