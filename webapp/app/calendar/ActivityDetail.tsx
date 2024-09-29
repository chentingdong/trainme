"use client";

import React, { useEffect } from "react";
import { getActivityById } from "../actions/activities";
import Loading from "../components/Loading";
import ActivityMap from "../activities/ActivityMap";
import { Modal } from "flowbite-react";
import type { activity as Activity } from "@trainme/db";
import { Map } from "@/utils/types";

type Props = {
  activityId: number | null;
};

export function ActivityDetail({ activityId }: Props) {
  const [activity, setActivity] = React.useState<Activity | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [summaryPolyline, setSummaryPolyline] = React.useState<string>();

  useEffect(() => {
    setLoading(true);
    if (activityId) {
      getActivityById(activityId)
        .then((activity) => {
          setActivity(activity);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    const sp = (activity?.map as Map)?.summary_polyline as string;
    if (sp) setSummaryPolyline(sp);
  }, [activityId, activity?.map]);

  return (
    <div className="m-4">
      <div>
        {loading && <Loading size={32} />}
        {activity && (
          <div className="text-gray-700 my-4">
            <h3>{activity.name}</h3>
            <div className="flex gap-4">
              <div>
                {new Date(
                  activity.start_date_local as string,
                ).toLocaleDateString()}
              </div>
              <div>{activity.type}</div>
              <div>{activity.distance} meters</div>
              <div>{activity.moving_time} seconds</div>
              <div>{activity.total_elevation_gain} meters</div>
            </div>
          </div>
        )}
      </div>
      <ActivityMap summary_polyline={summaryPolyline} className="h-96" />
    </div>
  );
}

type ActivityModalProps = {
  activityId: number | null;
  show: boolean;
  close: () => void;
};
export function ActivityDetailModal({
  activityId,
  show,
  close,
}: ActivityModalProps) {
  return (
    <Modal
      dismissible
      show={show}
      onClose={() => close()}
      size="xlg"
      position="top-center"
    >
      <Modal.Header>Activity Details</Modal.Header>
      <Modal.Body>
        <ActivityDetail activityId={activityId} />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={() => close()}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
