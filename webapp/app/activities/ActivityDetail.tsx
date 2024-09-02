"use client";

import React, { useEffect } from 'react';
import { Activity, getActivityFromStravaById } from '../actions/activities';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import Debug from '../components/Debug';
import polyline from 'polyline';
import { LatLngExpression } from 'leaflet';
import Loading from '../components/Loading';

type Props = {
  activityId: number | null;
};

export default function ActivityDetail({ activityId }: Props) {
  const [activity, setActivity] = React.useState<Activity | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (activityId) {
      getActivityFromStravaById(activityId)
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
  }, [activityId]);

  const decodePolyline = React.useMemo(() => {
    if (activity && activity.map && activity.map.summary_polyline) {
      return polyline
        .decode(activity.map.summary_polyline);
    } else {
      return [];
    }
  }, [activity]);

  // Calculate the center of the polyline
  const calculateCenter = React.useMemo(() => {
    const latitudes = decodePolyline.map(coord => coord[0]);
    const longitudes = decodePolyline.map(coord => coord[1]);
    const avgLatitude = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const avgLongitude = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
    return [avgLatitude, avgLongitude] as LatLngExpression;
  }, [decodePolyline]);

  const getPolylinePositions = React.useMemo(() => {
    return decodePolyline
      .map((point) => [point[0], point[1]]) as LatLngExpression[];
  }, [decodePolyline]);

  return (
    <div className='m-4'>
      <div>
        {loading && <Loading />}
        {activity && (
          <div className='text-gray-700'>
            <h3 >{activity.name}</h3>
            <div className="flex gap-4">
              <div>{new Date(activity.start_date_local).toLocaleDateString()}</div>
              <div>{activity.type}</div>
              <div>{activity.distance} meters</div>
              <div>{activity.moving_time} seconds</div>
              <div>{activity.total_elevation_gain} meters</div>
            </div>
          </div>
        )}
      </div>
      {activity?.map?.summary_polyline && (
        <MapContainer zoom={13} center={calculateCenter} style={{ width: '100%', height: 500 }}>
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <Polyline positions={getPolylinePositions} />
        </MapContainer>
      )}
    </div>
  );
}
