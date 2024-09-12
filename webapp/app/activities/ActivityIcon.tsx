import { GiRunningShoe, GiHiking } from 'react-icons/gi';
import { FaBiking, FaDumbbell, FaWalking } from 'react-icons/fa';
import { TbSwimming } from 'react-icons/tb';
import { GrYoga } from 'react-icons/gr';
import { LiaBikingSolid } from 'react-icons/lia';

interface Props {
  type: string;
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
      return <FaBiking className={getClassNames('btn-icon', 'bg-green-700 text-cyan-200')} />;
    case 'Swim':
      return <TbSwimming className={getClassNames('btn-icon', 'bg-blue-700 text-red-200')} />;
    case 'WeightTraining':
      return <FaDumbbell className={getClassNames('btn-icon', 'bg-yellow-700 text-purple-200')} />;
    case 'Yoga':
      return <GrYoga className={getClassNames('btn-icon', 'bg-purple-700 text-yellow-200')} />;
    case 'Walk':
      return <FaWalking className='btn-icon' />;
    case 'VirtualRide':
      return <LiaBikingSolid className={getClassNames('btn-icon', 'bg-green-700 text-cyan-200')} />;
    case 'Hike':
      return <GiHiking className='btn-icon' />;
    default:
      return <div></div>;
  }
}