import { GiRunningShoe } from 'react-icons/gi';
import { GiConverseShoe } from "react-icons/gi";
import { FaDumbbell, FaWalking } from 'react-icons/fa';
import { GiCycling } from "react-icons/gi";
import { BiCycling } from "react-icons/bi";
import { TbSwimming } from 'react-icons/tb';
import { TbStretching } from "react-icons/tb";

interface Props {
  type: string | null;
  withColor?: boolean;
}

export default function ActivityIcon({ type, withColor }: Props) {
  if (withColor === undefined) withColor = true;

  const getClassNames = (baseClass: string, colorClass: string) => {
    return withColor ? `${baseClass} ${colorClass}` : baseClass;
  };

  switch (type) {
    case 'Run':
      return <GiRunningShoe className={getClassNames('btn-icon', 'bg-red-700 text-green-200')} />;
    case 'Ride':
      return <GiCycling className={getClassNames('btn-icon', 'bg-green-700 text-cyan-200')} />;
    case 'VirtualRide':
      return <BiCycling className={getClassNames('btn-icon', 'bg-green-700 text-cyan-200')} />;
    case 'Swim':
      return <TbSwimming className={getClassNames('btn-icon', 'bg-blue-700 text-red-200')} />;
    case 'WeightTraining':
      return <FaDumbbell className={getClassNames('btn-icon', 'bg-yellow-700 text-purple-200')} />;
    case 'Yoga':
      return <TbStretching className={getClassNames('btn-icon', 'bg-purple-700 text-yellow-200')} />;
    case 'Walk':
      return <FaWalking className='btn-icon' />;
    case 'Hike':
      return <GiConverseShoe className='btn-icon' />;
    default:
      return <div></div>;
  }
}