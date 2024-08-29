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
  if (type === 'Run') {
    return <GiRunningShoe />;
  } else if (type === 'Ride') {
    return <FaPersonBiking />;
  } else if (type === 'Swim') {
    return <TbSwimming />;
  } else if (type === 'WeightTraining') {
    return <FaDumbbell />;
  } else if (type === 'Yoga') {
    return <div><GrYoga /></div>;
  } else if (type === 'Walk') {
    return <div><FaWalking /></div>;
  } else if (type === 'VirtualRide') {
    return <div><LiaBikingSolid /></div>;
  } else if (type === 'Hike') {
    return <div><GiHiking /></div>;
  }

  else {
    return <div></div>;
  }
}