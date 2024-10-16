"use client";

import React, { useEffect } from 'react';
import { trpc } from '@/app/api/trpc/client';
import { useSearchParams, useRouter } from 'next/navigation';

const AuthorizationHandler = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const authorizationCode = searchParams.get("code");

  const { data, isPending, error, mutate } = trpc.strava.updateRefreshToken.useMutation();

  useEffect(() => {
    if (authorizationCode) {
      mutate({ code: authorizationCode });
    }
  }, [authorizationCode, mutate]);

  useEffect(() => {
    if (data) {
      console.log("Strava authorization successful");
      router.push("/settings");
    }
  }, [data, router]);

  if (isPending) {
    return <div className="container"><p>Authorizing with Strava...</p></div>;
  }

  if (error) {
    return <div className="container"><p>Strava authorization failed: {error.message}</p></div>;
  }

  return <div className="container"><p>Processing Strava authorization...</p></div>;
};

export default AuthorizationHandler;
