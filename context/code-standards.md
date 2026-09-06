# Code Standards

## General

- Keep modules small and single-purpose
- Fix root causes, do not layer workarounds
-  Do not mix unrelated concerns in one component or route
- Respect the system boundaries defined in architecture.md

## TypeScript

- Strict mode is required throughout the project
- Avoid any — use explicit interfaces or narrowly
  scoped types
- Validate unknown external input at system
  boundaries before trusting it
- Use interface for object contract 

## Next.js

-  Default to server components
-  Add use client only when browser
  interactivity requires it]
-  Keep route handlers focused on a
  single responsibility
- Long-running work belongs in background tasks, not request handlers. 

## Styling

- Use CSS custom property tokens defined  globals.css  — no
  hardcoded hex values raw Tailwind color classes, like zinc-* or a hard-coded hex value
- reference tokens through shadcn's existing Tailwind utility names, repointed to the real palette in `context/ui-context.md`: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `border-destructive`, etc.
- maintain the border radius scale: rounded-xl for small components, rounded-2xl for cards,  rounded-3xl for modals 

## API Routes

-  Validate and parse request input before
  any logic runs
- Enforce auth and ownership before any mutation 
- Return consistent, predictable response shapes
- keep route handlers, then push complexity into shared modules or background tasks

## Data and Storage

- project metadata and relationships belong in Postgres SQL via Prisma
- canvas snapshots and generated specs belong in the Vercel blob. Prisma stores only the blob URL reference
- do not store large generated content directly in the database
- task run records are first-class relational data -  Treat ownership and run IDs as verified before any token issuance


## File Organization

- `[lib]/` — shared infrastructure: Prisma client, auth helpers, utilities
- `[trigger]/` — all durable background tasks and AI workflows
- `[components]/` — Components: UI composition only, no business logic.
- `[app/api]/` — Route handlers for auth triggering and persistence
- Name files after the responsibility they contain, not the technology
