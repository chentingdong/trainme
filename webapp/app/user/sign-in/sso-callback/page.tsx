"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '@/app/api/trpc/client';

export default function Page() {
  const searchParams = useSearchParams();
  const { isSignedIn, user } = useUser();

  const router = useRouter();

  const { mutateAsync: createUser } = trpc.user.create.useMutation();

  useEffect(() => {
    const saveUserAndRedirect = async () => {

      if (isSignedIn && user) {
        try {
          await createUser({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? ''
          });

          // Redirect to the original URL
          const redirectUrl = searchParams.get('redirect_url') || '/';
          console.log('redirectUrl', redirectUrl);
          router.push(redirectUrl);
        } catch (error) {
          console.error('Error saving user:', error);
          // Handle error (e.g., show a notification)
        }
      }
    };

    saveUserAndRedirect();
  }, [isSignedIn, user, searchParams, router, createUser]);

  return <div>Loading...</div>;
};

