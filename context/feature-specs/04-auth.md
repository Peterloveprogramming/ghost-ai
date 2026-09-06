Clerk is already installed and connected. Wire it into the Next.js app: provider, auth pages, redirects, route protection, and user menu.

## Design
Use Clerk's `dark` theme from `@clerk/ui/themes` as the base. Override Clerk appearance variables using the app's existing CSS variables. Do not hardcode colors.

### Sign-in and sign-up pages
- Large screens, simple two-panel layout
- Left: compact logo, tagline, short text only, feature list
- Right: centered Clerk form
- small screens: form only
- no gradients
- no oversized hero sections
- no features card
- no scroll heavy layout

## Implementation
- Wrap the root layout (inside `<body>`) with `ClerkProvider` using the Clerk `dark` theme
- create sign-in and sign-up pages using Clerk's `<SignIn />` and `<SignUp />` components, mounted on catch-all routes (`app/sign-in/[[...sign-in]]`, `app/sign-up/[[...sign-up]]`)
- use `proxy.ts` at the project root, not `middleware.ts` (Next.js 16 renamed the middleware convention to `proxy`)
- define public routes using the sign-in and sign-up envs (`NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`). Protect everything else by default with `auth.protect()`

Update `/`:
- authenticated users redirect to `/editor`
- unauthenticated users redirect to `sign-in`

Add Clerk's built-in `<UserButton />` to the editor nav bar right section for profile settings and logout. Keep Clerk's default user menu and profile flows intact. Do not rebuild or heavily customize Clerk components. Use Clerk's existing components as-is. Do not rename or invent new ones.

## Dependencies

install: `@clerk/ui` (provides the `dark` theme via `@clerk/ui/themes`)

## Check when done
- `proxy.ts` exists at the root
- all routes are protected except public auth paths
- auth pages use css variables with no hard coded colors
- `ClerkProvider` wraps the root layout
- `npm run build` passes

## Implementation notes (2026-09-06)
Delivered. Deviations from the original draft, all confirmed with the user:
- Original said `Cloak` component — no such component exists; used `<SignIn />` / `<SignUp />` from `@clerk/nextjs`.
- Original said theme path `clerks/ui/themes` — corrected to `@clerk/ui/themes` (the real path for `@clerk/nextjs` v7; `@clerk/themes` is the Core 2 / v6 package).
- Original said "existing sign-in and sign-up envs" — those did not exist; added `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` to `.env.local`.
- Route protection uses a plain pathname check against the public routes (not `createRouteMatcher`, which `@clerk/nextjs` v7 marks deprecated).
