"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getActivities } from '@/app/actions/activities';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/distanceUtils';
import ActivityIcon from './ActivityIcon';
import ActivityMap from './ActivityMap';
import ActivityLaps from './ActivityLaps';
import type { activity as Activity } from '@prisma/client';

type Props = {};

function Page({ }: Props) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchActivities = async () => {
    setLoading(true);
    const newActivities = await getActivities(startDate, endDate);
    setActivities((prevActivities) => [...prevActivities, ...newActivities]);
    setLoading(false);
  }
  useEffect(() => {
    if (typeof window === 'undefined') return;
    fetchActivities();
  }, [page]);

  const lastActivityRef = useCallback((node: HTMLLIElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);


  return (
    <div>
      <h1 className='h1'>Activities</h1>
      <ul>
        {activities.map((activity, index) => (
          <li
            key={index}
            className='card my-2'
            ref={index === activities.length - 1 ? lastActivityRef : null}
          >
            <div className='card-header flex items-center'>
              <ActivityIcon type={activity.type} />
              <div className='mx-4'>{activity.name}</div>
            </div>
            <div className="card-body">
              <div className='my-4'>
                <div className="flex gap-4">
                  <div>{activity.type}</div>
                  <div>{activity.distance} meters</div>
                  <div>{activity.moving_time} seconds</div>
                  <div>{activity.total_elevation_gain} meters</div>
                </div>
              </div>
              {(activity.map && typeof activity.map === 'object' && 'summary_polyline' in activity.map && typeof activity.map.summary_polyline === 'string') && (
                <div className="grid grid-cols-5 gap-8 h-128">
                  <ActivityMap className='col-span-2' summary_polyline={activity.map.summary_polyline} />
                  <ActivityLaps className='col-span-3' activityId={activity.id} />
                </div>
              )}
            </div>
            <div className='card-footer'>
              {formatDistance(activity?.distance || 0)} miles in {formatTimeSeconds(activity?.moving_time || 0)}
            </div>
          </li>
        ))}
      </ul>
      {loading && <div>Loading more activities...</div>}
    </div>
  );
}

export default Page;