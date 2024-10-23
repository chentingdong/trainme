import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  "/",
  "/user/sign-in(.*)",
  "/user/sign-in/sso-callback(.*)",
  "/user-sign-up(.*)",
]);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request)) {
      const originalUrl = request.nextUrl.href;
      await auth.protect({
        unauthorizedUrl: `${BASE_URL}/user/sign-in?redirect_url=${encodeURIComponent(originalUrl)}`,
        unauthenticatedUrl: `${BASE_URL}/user/sign-in?redirect_url=${encodeURIComponent(originalUrl)}`,
      });
    }
  },
  { clockSkewInMs: 60000 },
);

export const config = {
  // Skip Next.js internals and all static files, unless found in search params
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
    '/((?!.*\\..*|_next).*)',
  ],
};
