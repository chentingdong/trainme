"use client";

import React, { useState, useEffect } from 'react';
import { getActiveSportTypes } from '../actions/sportType';
import { sport_type as SportType } from '@prisma/client';
import { Select } from 'flowbite-react';

type Props = {
  sportType: string | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SportTypeSelect({ sportType, onChange }: Props) {
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  useEffect(() => {
    getActiveSportTypes().then((data) => {
      setSportTypes(data);
    });
  }, []);
  return (
    <Select
      id='type'
      className='form-control'
      value={sportType ?? '-'}
      onChange={onChange}
    >
      {sportTypes.map((sportType) => (
        <option key={sportType.id}>{sportType.sport_type}</option>
      ))}
    </Select>
  );
}