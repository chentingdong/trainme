"use client";

import React, { useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/router';

const SsoCallback = () => {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        await handleRedirectCallback({
          afterSignInUrl: searchParams.get('after_sign_in_url') || '/',
        });
        const redirectUrl = searchParams.get('after_sign_in_url') || '/';
        router.push(redirectUrl);
      } catch (error) {
        console.error('Error handling SSO callback:', error);
        // Optionally, redirect to an error page or show an error message
      }
    };

    handleCallback();
  }, [handleRedirectCallback, router]);

  return <div>Loading...</div>;
};

export default SsoCallback;
