"use client";

import { trpc } from "@/app/api/trpc/client";

export default function Athlete() {
  const { data: athlete } = trpc.user.athlete.useQuery();
  return <div>{athlete?.firstname}</div>;
}
