import React, { useRef, useEffect, useState } from 'react';
import { getActivityLaps } from '@/app/actions/laps';
import Debug from '../components/Debug';
import { Tooltip } from 'flowbite-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, LabelList } from 'recharts';

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
  const [laps, setLaps] = useState<Lap[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartWidth, setChartWidth] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getActivityLaps(activityId)
      .then((laps) => {
        setLaps(laps);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activityId]);

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.offsetWidth);
    }
  }, [chartRef.current]);

  // Convert average speed (m/s) to pace (min/mile)
  const lapsWithPace = laps.map(lap => ({
    ...lap,
    pace: (26.8224 / lap.average_speed).toFixed(2)
    // 26.8224 is the conversion factor from m/s to min/mile
  }));

  const CustomLabel = (props: any) => {
    const { x, y, value, height } = props;
    return (
      <text x={chartWidth - 5} y={y + height / 2} fill="#ffffff" textAnchor="end" dominantBaseline="middle">
        {`${value} min/mile`}
      </text>
    );
  };

  return (
    <div ref={chartRef} style={{ width: '100%', maxHeight: 50 * laps.length }}>
      <h2>Lap pace</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={lapsWithPace}
          layout="vertical"
          barSize={20} // Fixed horizontal width for bars
          barCategoryGap="5px" // Set a fixed pixel value for the gap between bars
          barGap={0} // No gap between bars within the same category
        >
          <XAxis type="number" dataKey="pace" hide />
          <YAxis type="category" dataKey="name" hide />
          <Bar dataKey="pace" fill="#0f766e">
            <LabelList dataKey="pace" content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}