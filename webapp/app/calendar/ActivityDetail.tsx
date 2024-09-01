import React from 'react';

type Props = {
  activityId: number | null;
};

export default function ActivityDetail({ activityId }: Props) {
  return (
    <div>ActivityDetail: {activityId}</div>
  );
}