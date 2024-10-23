"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const originalRedirectUrl = searchParams.get('redirect_url') || '/';

  return (
    <div className="mt-14 flex justify-center">
      <SignIn
        routing="hash"
        forceRedirectUrl={`/user/sign-in/sso-callback?redirect_url=${encodeURIComponent(originalRedirectUrl)}`}
      />
    </div>
  );
}
