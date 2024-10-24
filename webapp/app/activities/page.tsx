"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ActivityOne from "./ActivityOne";
import { trpc } from '@/app/api/trpc/client';
import Loading from '@/app/components/Loading';
import { ActivityWithLaps } from '@/utils/types';

function Page() {
  const [page, setPage] = useState(0); 
  const observer = useRef<IntersectionObserver | null>(null);
  const [allActivities, setAllActivities] = useState<ActivityWithLaps[]>([]);

  const { data, isLoading, isError, isFetching } = trpc.activities.getMany.useQuery({
    cursor: page,
    limit: 5,
  });

  useEffect(() => {
    if (data && data.activities) {
      setAllActivities((prevActivities) => [...prevActivities, ...data.activities]);
    }
  }, [allActivities, data]);
  const hasMore = data?.hasMore; 

  const lastActivityRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isLoading || isFetching || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, hasMore]
  );

  if (!allActivities || allActivities.length === 0) return <></>;
  if (isError) return <div>Error loading activities</div>;

  return (
    <div>
      <h1 className="h1">Activities</h1>
      <ul>
        {allActivities.map((activity, index) => (
          <li
            key={index}
            className="card my-2"
            ref={index === allActivities.length - 1 ? lastActivityRef : null}
          >
            <ActivityOne activity={activity} />
          </li>
        ))}
      </ul>
      {isLoading && <div><Loading /> Loading more activities...</div>}
    </div>
  );
}

export default Page;