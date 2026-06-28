import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/how-it-works",
  "/terms",
  "/privacy",
  "/msa",
  "/maintenance",
  "/api/webhooks/(.*)",
  "/api/abuse-report",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { sessionClaims } = await auth.protect();

  if (isAdminRoute(req)) {
    const role = (sessionClaims as Record<string, unknown>)?.metadata as
      | { role?: string }
      | undefined;
    if (!role?.role || !["admin", "developer", "pm"].includes(role.role)) {
      return Response.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
