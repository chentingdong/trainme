"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Lap, getStravaActivityLaps } from '@/app/actions/laps';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, LabelList } from 'recharts';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/distanceUtils';

type Props = {
  activityId: number;
  className?: string;
};

export default function ActivityLaps({ activityId, className }: Props) {
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
  const lapWithPace = laps.map((lap) => {
    const paceInMinutesPerMile = 26.8224 / lap.average_speed; // Convert m/s to min/mile
    const minutes = Math.floor(paceInMinutesPerMile);
    const seconds = Math.round((paceInMinutesPerMile - minutes) * 60);
    const pace = `${minutes}:${seconds.toString().padStart(2, '0')}`; // Format as mm:ss/mile    return {
    return {
      ...lap,
      pace: paceInMinutesPerMile,
      formattedPace: pace,
    };
  });

  const barSize = 20;

  return (
    <div ref={chartRef} className={className} style={{ width: '100%', maxHeight: barSize * laps.length }}>
      {loading && <div>Loading...</div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 grid grid-cols-4">
          <div>Lap</div>
          <div>Time</div>
          <div>Dist (miles)</div>
          <div>Pace (min/mile)</div>
        </div>
        <div className='col-span-1'>Pace</div>
      </div>
      <div className="grid grid-cols-2 gap-2 h-full">
        <div className="col-span-1 h-full">
          {
            lapWithPace.map((lap, index) => (
              <div className="gap-2 grid grid-cols-4" key={index}>
                <div >{index + 1}</div>
                <div >{formatTimeSeconds(lap.elapsed_time)}</div>
                <div >{formatDistance(lap.distance)}</div>
                <div >{lap.formattedPace}</div>
              </div>
            ))
          }
        </div>
        <div className="col-span-1 flex flex-col h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={lapWithPace}
              layout="vertical"
              barSize={barSize * 0.8} // Fixed horizontal width for bars
              barCategoryGap={2} // Set a fixed pixel value for the gap between bars
              barGap={0} // No gap between bars within the same category
            >
              <XAxis
                type="number"
                dataKey="pace"
                hide
              />
              <YAxis type="category" dataKey="id" hide />
              <Bar dataKey="pace" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}