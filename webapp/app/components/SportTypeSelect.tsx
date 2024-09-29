"use client";

import React, { useState, useEffect } from "react";
import { getActiveSportTypes } from "../actions/sportType";
import { sport_type as SportType } from "@trainme/db";
import { Select } from "flowbite-react";

type Props = {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    selectedSportId: string,
  ) => void;
};

export default function SportTypeSelect({ value, onChange }: Props) {
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);

  useEffect(() => {
    getActiveSportTypes().then((data) => {
      setSportTypes(data);
    });
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSportId = e.target.value;
    onChange(e, selectedSportId);
  };
  return (
    <Select
      id="type"
      className="form-control"
      value={value}
      onChange={handleSelect}
    >
      {sportTypes.map((sportType) => (
        <option key={sportType.id} value={sportType.id}>
          {sportType.sport_type}
        </option>
      ))}
    </Select>
  );
}
