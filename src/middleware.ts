import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PREVIEW_MODE = !process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY === "sk_test_placeholder";

let clerkMiddlewareHandler: ReturnType<typeof import("@clerk/nextjs/server").clerkMiddleware> | null = null;

async function getClerkMiddleware() {
  if (!clerkMiddlewareHandler) {
    const { clerkMiddleware, createRouteMatcher } = await import("@clerk/nextjs/server");
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

    clerkMiddlewareHandler = clerkMiddleware(async (auth, req) => {
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
  }
  return clerkMiddlewareHandler!;
}

export default async function middleware(req: NextRequest) {
  if (PREVIEW_MODE) {
    return NextResponse.next();
  }
  const handler = await getClerkMiddleware();
  return handler(req, {} as any);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
