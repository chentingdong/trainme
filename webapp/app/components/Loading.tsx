import React from 'react';
import { ImSpinner2 } from "react-icons/im";

type Props = {
  size?: number;
  className?: string;
};

export default function Loading({ size = 32, className = '' }: Props) {
  const combinedClassName = 'flex items-center gap-4 loading ' + className;
  return (
    <div className={combinedClassName}>
      <ImSpinner2 className="loading-icon text-green-700" style={{ width: size, height: size }} />
    </div>
  );
}