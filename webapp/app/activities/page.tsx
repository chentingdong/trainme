"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Activity, getStravaActivities } from '@/app/actions/activities';
import { formatTimeSeconds } from '@/utils/timeUtils';
import { formatDistance } from '@/utils/distanceUtils';
import ActivityIcon from './ActivityIcon';
import ActivityMap from './ActivityMap';
import ActivityLaps from './ActivityLaps';

type Props = {};

function Page({ }: Props) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    const newActivities = await getStravaActivities(startDate, endDate, page);
    setActivities((prevActivities) => [...prevActivities, ...newActivities]);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

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
      <h1>Activities</h1>
      <ul>
        {activities.map((activity, index) => (
          <li
            key={activity.id}
            className='card my-2'
            ref={index === activities.length - 1 ? lastActivityRef : null}
          >
            <div className='card-header flex items-center'>
              <ActivityIcon type={activity.type} />
              <div className='mx-4'>{activity.name}</div>
              <div className='text-sm'>{new Date(activity.start_date_local).toLocaleDateString()}</div>
            </div>
            <div className="card-body">
              <div className='my-4'>
                <div className="flex gap-4">
                  <div>{new Date(activity.start_date_local).toLocaleDateString()}</div>
                  <div>{activity.type}</div>
                  <div>{activity.distance} meters</div>
                  <div>{activity.moving_time} seconds</div>
                  <div>{activity.total_elevation_gain} meters</div>
                </div>
              </div>
              {activity.map?.summary_polyline && (
                <div className="grid grid-cols-2 gap-8 h-128">
                  <ActivityMap summary_polyline={activity.map?.summary_polyline} />
                  <ActivityLaps activityId={activity.id} />
                </div>
              )}
            </div>
            <div className='card-footer'>
              {formatDistance(activity.distance)} miles in {formatTimeSeconds(activity.moving_time)}
            </div>
          </li>
        ))}
      </ul>
      {loading && <div>Loading more activities...</div>}
    </div>
  );
}

export default Page;