"use client";

import React from "react";
import { Select } from "flowbite-react";
import { trpc } from '@/app/api/trpc/client';
import Loading from '@/app/loading';

type Props = {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    selectedSportId: string,
  ) => void;
};

export default function SportTypeSelect({ value, onChange }: Props) {
  const { data: sportTypes, isLoading, isError } = trpc.sports.getSportTypes.useQuery();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSportId = e.target.value;
    onChange(e, selectedSportId);
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading sport types</div>;

  return (
    <Select
      id="type"
      className="form-control"
      value={value}
      onChange={handleSelect}
    >
      {!sportTypes && <option>No sport types</option>}
      {sportTypes && sportTypes.map((sportType) => (
        <option key={sportType.id} value={sportType.sport_type}>
          {sportType.sport_type}
        </option>
      ))}
    </Select>
  );
}
