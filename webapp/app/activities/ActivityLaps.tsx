"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Lap, getStravaActivityLaps } from '@/app/actions/laps';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, LabelList } from 'recharts';

type Props = {
  activityId: number;
};

export default function ActivityLaps({ activityId }: Props) {
  const [laps, setLaps] = useState<Lap[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartWidth, setChartWidth] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getStravaActivityLaps(activityId)
      .then((resp) => {
        setLaps(resp);
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
  }, []);

  // Convert average speed (m/s) to pace (min/mile)
  const lapsWithPace = laps.map(lap => ({
    ...lap,
    pace: (26.8224 / lap.average_speed).toFixed(2) // 26.8224 is the conversion factor from m/s to min/mile
  }));

  // Calculate the maximum pace value
  const maxPace = Math.max(...lapsWithPace.map(lap => parseFloat(lap.pace)));
  const minPace = Math.min(...lapsWithPace.map(lap => parseFloat(lap.pace)));

  // Calculate the inverse pace values
  const lapsWithInversePace = lapsWithPace.map(lap => ({
    ...lap,
    inversePace: (maxPace - parseFloat(lap.pace) + minPace).toFixed(2)
  }));

  const CustomLabel = (props: any) => {
    const { x, y, value, height } = props;
    return (
      <text x={x + chartWidth - 5} y={y + height / 2} textAnchor="end" dominantBaseline="middle">
        {`${value} min/mile`}
      </text>
    );
  };

  const barSize = 15;

  return (
    <div ref={chartRef} style={{ width: '100%', maxHeight: barSize * laps.length }}>
      <h2>Lap pace</h2>
      {loading && <div>Loading...</div>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={lapsWithInversePace}
          layout="vertical"
          barSize={barSize * 0.8} // Fixed horizontal width for bars
          barCategoryGap={2} // Set a fixed pixel value for the gap between bars
          barGap={0} // No gap between bars within the same category
        >
          <XAxis
            type="number"
            dataKey="inversePace"
            hide
            domain={[0, maxPace * 2]} // Set max to the maximum pace value
          />
          <YAxis type="category" dataKey="name" hide />
          <Bar dataKey="inversePace" fill="#0f766e">
            <LabelList dataKey="pace" content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}