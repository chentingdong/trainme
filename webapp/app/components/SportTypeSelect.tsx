"use client";

import React from "react";
import { Select } from "flowbite-react";
import { trpc } from '@/app/api/trpc/client';
import type { Sport } from "@trainme/db";
import Loading from '@/app/loading';
type Props = {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    selectedSportId: string,
  ) => void;
};

export default function SportTypeSelect({ value, onChange }: Props) {
  const { data: sportTypes, isLoading, isError } = trpc.sports.getSportTypes.useQuery<Sport[]>();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSportId = e.target.value;
    onChange(e, selectedSportId);
  };

  return (
    <div className="relative flex items-center ">
      <Select
        id="type"
        className="form-control flex-grow"
        value={value}
        onChange={handleSelect}
      >
        {isLoading && <option>Loading...</option>}
        {isError || !isLoading && !sportTypes && <option>No sport types</option>}
        {sportTypes && sportTypes.map((sportType: Sport) => (
          <option key={sportType.id} value={sportType.sportType}>
            {sportType.sportType}
          </option>
        ))}
      </Select>
      {isLoading && (
        <Loading className="absolute right-3 w-3 h-3" />
      )}
    </div>
  );
}
