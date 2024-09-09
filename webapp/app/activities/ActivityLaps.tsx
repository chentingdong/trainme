"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Lap, getStravaActivityLaps } from '@/app/actions/laps';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, LabelList } from 'recharts';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/distanceUtils';

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
  const lapWithPace = laps.map((lap) => {
    const pace = 26.8224 / lap.average_speed; // Convert m/s to min/mile
    return {
      ...lap,
      pace: pace,
    };
  });

  const barSize = 20;

  return (
    <div ref={chartRef} style={{ width: '100%', maxHeight: barSize * laps.length }}>
      {loading && <div>Loading...</div>}
      <div className="grid grid-cols-6 gap-4">
        <div className='col-span-1'>Lap</div>
        <div className='col-span-1'>Time</div>
        <div className='col-span-1'>Distance (miles)</div>
        <div className='col-span-3'>Pace</div>
      </div>
      <div className="grid grid-cols-6 gap-4 h-full">
        <div className="col-span-1  h-full">
          {
            laps.map((lap, index) => (
              <div key={lap.id}>{index + 1}</div>
            ))
          }
        </div>
        <div className="col-span-1 h-full">
          {
            laps.map((lap) => (
              <div key={lap.id}>{formatTimeSeconds(lap.elapsed_time)}</div>
            ))
          }
        </div>
        <div className="col-span-1 h-full">
          {
            laps.map((lap) => (
              <div key={lap.id}>{formatDistance(lap.distance)}</div>
            ))
          }
        </div>
        <div className="col-span-3 flex flex-col h-full">
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
              <Bar dataKey="pace" fill="#0f766e">
                {/* <LabelList dataKey="pace" content={(props) => <CustomLabel {...props} />} /> */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}