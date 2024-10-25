import { GiRunningShoe } from "react-icons/gi";
import { GiConverseShoe } from "react-icons/gi";
import { FaDumbbell, FaWalking } from "react-icons/fa";
import { GiCycling } from "react-icons/gi";
import { BiCycling } from "react-icons/bi";
import { TbSwimming } from "react-icons/tb";
import { TbStretching } from "react-icons/tb";
import { cn } from '@/utils/helper';

interface Props {
  type: string | null | undefined;
  withColor?: boolean;
  className?: string;
}

export default function SportIcon({ type, withColor, className }: Props) {
  if (withColor === undefined) withColor = true;

  switch (type) {
    case "Run":
      return (
        <GiRunningShoe
          className={cn("btn-icon", "bg-red-700 text-green-200", className)}
        />
      );
    case "Ride":
      return (
        <GiCycling
          className={cn("btn-icon", "bg-green-700 text-cyan-200", className)}
        />
      );
    case "VirtualRide":
      return (
        <BiCycling
          className={cn("btn-icon", "bg-green-700 text-cyan-200", className)}
        />
      );
    case "Swim":
      return (
        <TbSwimming
          className={cn("btn-icon", "bg-blue-700 text-red-200", className)}
        />
      );
    case "WeightTraining":
      return (
        <FaDumbbell
          className={cn("btn-icon", "bg-yellow-700 text-purple-200", className)}
        />
      );
    case "Yoga":
      return (
        <TbStretching
          className={cn("btn-icon", "bg-purple-700 text-yellow-200", className)}
        />
      );
    case "Walk":
      return <FaWalking className="btn-icon" />;
    case "Hike":
      return <GiConverseShoe className="btn-icon" />;
    default:
      return <div></div>;
  }
}
