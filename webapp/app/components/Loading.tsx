import React from 'react';
import { ImSpinner2 } from "react-icons/im";

type Props = {
  size?: number;
};

export default function Loading({ size = 32 }: Props) {
  return (
    <div className='flex items-center gap-4 loading'>
      <ImSpinner2 className="loading-icon text-green-700" style={{ width: size, height: size }} />
    </div>
  );
}