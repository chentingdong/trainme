import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  "/",
  "/user/sign-in(.*)",
  "/user/sso-callback(.*)",
  "/user/sign-up(.*)",
]);

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect();
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
