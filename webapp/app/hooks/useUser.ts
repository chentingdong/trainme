import { useAuth, useUser as useClerkUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { db } from '@trainme/db';

type ExtendedUser = {
  clerkUser: ReturnType<typeof useClerkUser>['user'];
  stravaRefreshToken: string | null;
};

export const useUser = async () => {
  const { userId } = useAuth();
  const { user: clerkUser } = useClerkUser();
  const [extendedUser, setExtendedUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId && clerkUser) {
        const dbUser = await db.user.findUnique({
          where: { id: userId },
          select: { stravaRefreshToken: true }
        });

        setExtendedUser({
          clerkUser,
          stravaRefreshToken: dbUser?.stravaRefreshToken ?? null
        });
      }
    };

    fetchUser();
  }, [userId, clerkUser]);

  return extendedUser;
};
