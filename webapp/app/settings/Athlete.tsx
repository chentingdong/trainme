"use client";

import { trpc } from "@/app/api/trpc/client";
import Loading from '@/app/loading';
import { Card } from "flowbite-react";
import Image from "next/image";
export default function Athlete() {
  const { data: athlete, isLoading, error } = trpc.user.athlete.useQuery();

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!athlete) return <div>No athlete data</div>;

  return (
    <Card className="athlete-profile max-w-md p-4 rounded-lg">
      <Image src={athlete.profileMedium || athlete.profile || ''} alt='' width={100} height={100} />
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {`${athlete.firstname} ${athlete.lastname}`}
      </h5>
      <div className="flex flex-col gap-4 font-normal text-gray-700 dark:text-gray-400">
        <p>{`Location: ${athlete.city}, ${athlete.country}`}</p>
        <p>{`Sex: ${athlete.sex}`}</p>
        <p>{`Premium Member: ${athlete.premium ? 'Yes' : 'No'}`}</p>
        <p>{`Followers: ${athlete.followerCount}`}</p>
        <p>{`Friends: ${athlete.friendCount}`}</p>
        <p>{`Weight: ${athlete.weight?.toFixed(2) || 'N/A'} kg`}</p>
      </div>
    </Card>
  );
}
