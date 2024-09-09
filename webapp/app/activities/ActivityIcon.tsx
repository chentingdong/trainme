import React from 'react';
import { GiRunningShoe } from "react-icons/gi";
import { FaPersonBiking } from "react-icons/fa6";
import { LiaBikingSolid } from "react-icons/lia";
import { TbSwimming } from "react-icons/tb";
import { FaDumbbell } from "react-icons/fa6";
import { GrYoga } from "react-icons/gr";
import { FaWalking } from "react-icons/fa";
import { GiHiking } from "react-icons/gi";

type Props = {
  type: string;
};

export default function ActivityIcon({ type }: Props) {
  switch (type) {
    case 'Run':
      return <GiRunningShoe className="btn btn-icon bg-red-700 text-green-200" />;
    case 'Ride':
      return <FaPersonBiking className='btn-icon bg-green-700 text-cyan-200' />;
    case 'Swim':
      return <TbSwimming className='btn-icon bg-blue-700 text-red-200' />;
    case 'WeightTraining':
      return <FaDumbbell className='btn-icon bg-yellow-700 text-purple-200' />;
    case 'Yoga':
      return <GrYoga className='btn-icon bg-purple-700 text-yellow-200' />;
    case 'Walk':
      return <FaWalking className='btn-icon' />;
    case 'VirtualRide':
      return <LiaBikingSolid className='btn-icon bg-green-700 text-cyan-200' />;
    case 'Hike':
      return <GiHiking className='btn-icon ' />;
    default:
      return <div></div>;
  }
}