"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import polyline from 'polyline';
import 'leaflet/dist/leaflet.css';

interface Props {
  summary_polyline: string | undefined;
}

const ActivityMap: React.FC<Props> = ({ summary_polyline }) => {
  const [center, setCenter] = useState<LatLngExpression | null>(null);
  const [positions, setPositions] = useState<LatLngExpression[]>([]);

  useEffect(() => {
    if (summary_polyline) {
      const decodedPolyline = polyline.decode(summary_polyline);
      if (decodedPolyline.length) {
        const latitudes = decodedPolyline.map(coord => coord[0]);
        const longitudes = decodedPolyline.map(coord => coord[1]);
        const avgLatitude = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const avgLongitude = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

        setCenter([avgLatitude, avgLongitude]);
        setPositions(decodedPolyline.map(coord => [coord[0], coord[1]]) as LatLngExpression[]);
      }
    }
  }, [summary_polyline]);

  if (!center || positions.length === 0) {
    // Avoid rendering the map until the positions are ready
    return null;
  }

  return (
    <MapContainer center={center} zoom={14} className="w-full h-full min-h-48">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={positions} color='#0d9488' smoothFactor={4} weight={5} />
    </MapContainer>
  );
};

export default ActivityMap;;