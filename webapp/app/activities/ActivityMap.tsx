"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import polyline from 'polyline';
import 'leaflet/dist/leaflet.css';

interface Props {
  summary_polyline: string | undefined;
  className?: string;
}
const ActivityMap: React.FC<Props> = ({ summary_polyline, className = '' }) => {
  const combinedClassName = `activity-map ${className}`;

  if (!summary_polyline) {
    return <></>;
  }

  const decodedPolyline = polyline.decode(summary_polyline);
  const latitudes = decodedPolyline.map(coord => coord[0]);
  const longitudes = decodedPolyline.map(coord => coord[1]);
  const avgLatitude = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
  const avgLongitude = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
  const center: [number, number] = [avgLatitude, avgLongitude];
  const positions = decodedPolyline.map(coord => [coord[0], coord[1]]) as LatLngExpression[];


  return (
    <MapContainer center={center} zoom={13} className={combinedClassName}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={positions} color='#0d9488' smoothFactor={4} weight={5} />
    </MapContainer>
  );
};

export default ActivityMap;;