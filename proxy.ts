import { clerkMiddleware } from "@clerk/nextjs/server"

// Public routes are derived from the sign-in / sign-up env vars so the list
// stays in sync with Clerk's own redirect configuration. Everything else is
// protected by default.
//
// A configured value is only honoured when it is a non-empty, non-whitespace
// string; anything else falls back to the default so publicRoutes can never
// contain an empty string (which would make every path match and bypass
// auth.protect()).
const publicRouteFromEnv = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

const signInUrl = publicRouteFromEnv(
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  "/sign-in",
)
const signUpUrl = publicRouteFromEnv(
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  "/sign-up",
)
const publicRoutes = [signInUrl, signUpUrl]

const isPublicRoute = (pathname: string) =>
  publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request.nextUrl.pathname)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
