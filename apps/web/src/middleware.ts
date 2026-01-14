import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
  "/api/webhooks(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isClerkTaskRoute = createRouteMatcher(["/auth/sign-up/tasks(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Allow Clerk task routes (organization chooser, etc.)
  if (isClerkTaskRoute(req)) {
    return NextResponse.next();
  }

  // Protect all other routes
  await auth.protect();

  // If user is authenticated but has no organization and not on onboarding page
  if (userId && !orgId && !isOnboardingRoute(req)) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // If user is on onboarding but already has an organization, redirect to dashboard
  if (userId && orgId && isOnboardingRoute(req)) {
    const dashboardUrl = new URL("/parent/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
