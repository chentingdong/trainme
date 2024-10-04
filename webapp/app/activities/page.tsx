"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import type { activity as Activity } from "@trainme/db";
import ActivityOne from "./ActivityOne";
import { getActivities } from '@/app/api/strava/activities';

function Page() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchActivities = async () => {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const newActivities = await getActivities(startDate, endDate);
      setActivities((prevActivities) => [...prevActivities, ...newActivities]);
      setLoading(false);
    };
    fetchActivities();
  }, [page]);

  const lastActivityRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading],
  );

  return (
    <div>
      <h1 className="h1">Activities</h1>
      <ul>
        {activities.map((activity, index) => (
          <li
            key={index}
            className="card my-2"
            ref={index === activities.length - 1 ? lastActivityRef : null}
          >
            <ActivityOne activity={activity} />
          </li>
        ))}
      </ul>
      {loading && <div>Loading more activities...</div>}
    </div>
  );
}

export default Page;
