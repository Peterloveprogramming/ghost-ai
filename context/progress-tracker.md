# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In progress

## Current Goal

- Continue building the editor chrome per 03-editor.md, then extend it in the chapters that follow.

## Completed

- 01-design-system.md — shadcn/ui installed and configured (`components.json`, base-nova style, neutral base color). Added Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea under `components/ui/*` (unmodified, generated). Added `lucide-react`. `lib/utils.ts` exports `cn()` (clsx + tailwind-merge). Restored the shadcn dark theme CSS variables in `app/globals.css` (previously stripped down to a bare `@import "tailwindcss";`, which left components unstyled) — `html` carries the `dark` class in `app/layout.tsx`, so the `.dark` variable block is always active (dark-only, no light mode). Verified: `npm run build` passes, `npm run dev` serves the home page with no console/server errors, and no default light styling appears.
- 02-theme-tokens.md — repointed the `.dark` block in `app/globals.css` to the real hex values from `context/ui-context.md` per the mapping table in `context/feature-specs/02-theme-tokens.md`: `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--border`, `--input`, `--ring`. Shadcn's variable names kept unchanged; `--chart-*`, `--sidebar-*`, and the entire `:root` block left untouched (still shadcn oklch defaults). `components/ui/*` not modified. Verified: `npm run build` passes; `npm run dev` served the home page and the compiled CSS confirmed `.dark` now serves `#08080a` background / `#00c8d4` primary (only Button is currently rendered on the page — Card, Dialog, Input, Tabs, Textarea, ScrollArea have no consumer yet to smoke-test against).
- 03-editor.md — added the editor chrome shell:
  - `components/editor/editor-navbar.tsx` — `EditorNavbar`, a client component (needs the toggle button's `onClick`). Fixed `h-14` bar, `bg-card` (`--bg-surface`) with `border-b border-border`, three flex-1 sections (left/center/right). Controlled via props (`isSidebarOpen`, `onToggleSidebar`) rather than owning its own state, since the sidebar's open/closed state has to be shared with `ProjectSidebar` by whatever screen composes them — swaps `PanelLeftOpen`/`PanelLeftClose` (lucide-react) on `isSidebarOpen`. Right section left empty per spec.
  - `components/editor/project-sidebar.tsx` — `ProjectSidebar`, a client component. `fixed` positioning (`top-14 bottom-0 left-0`, `z-40`) so it overlays the canvas instead of pushing layout, `bg-popover` (`--bg-elevated`) surface, slides via `translate-x-0` / `-translate-x-full` with a `transition-transform` (controlled by the `isOpen` prop). Header row shows `projectTitle` (prop) + close button (`onClose` prop, X icon). Body is the existing shadcn `Tabs` with two tabs, each showing an empty-state placeholder string ("No templates yet" / "No layers yet") — see Open Questions on the tab labels. Footer is a full-width `Button` with a `Plus` icon reading "New Project" (no handler wired yet — out of scope for this spec).
  - Dialog pattern: no new file needed. `components/ui/dialog.tsx` (shadcn-generated, protected) already exports `DialogTitle`, `DialogDescription`, and `DialogFooter` built on the real theme tokens (`bg-popover`, `text-popover-foreground`, etc. — confirmed live in 02-theme-tokens.md). Spec explicitly says not to build an actual dialog instance yet, so this increment only confirms the primitive is ready for a future chapter to consume.
  - Verified: `npx tsc --noEmit` and `npm run lint` both pass clean; `npm run build` passes. Temporarily mounted both components in `app/page.tsx` with local `useState` to smoke-test in the dev server (curled the SSR output) — confirmed the closed-state HTML renders `-translate-x-full` on the sidebar, `panel-left-open` icon in the navbar, both `aria-label`s ("Open sidebar" / "Close sidebar"), and the tab/button placeholder text, with no server console errors — then reverted `app/page.tsx` to its prior content. Neither component is wired into a real route yet (none was requested by this spec).
- Composed the chrome into a real route (follow-up to 03-editor.md, still no `04-*.md` spec):
  - `components/editor/editor-shell.tsx` — new `EditorShell` client component. Owns the `isSidebarOpen` state (`useState`) and renders `EditorNavbar` + `ProjectSidebar` wired to it, plus a `children` slot below the navbar for the route's own content. Takes `projectTitle` as a prop and forwards it to `ProjectSidebar`. This is the "future component" that Architecture Decisions below previously called out as owning the shared toggle state.
  - `app/editor/layout.tsx` — new route segment `/editor`. Server component; renders `EditorShell` with `projectTitle="Untitled Project"` (hardcoded — there's no project data layer yet, see Open Questions) wrapping `children`.
  - `app/editor/page.tsx` — placeholder page ("Canvas coming soon") so the layout has something to wrap; this is not the real canvas feature, just enough to prove composition works.
  - Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass (build required one pass to generate the `LayoutProps<"/editor">` route type before `tsc` would accept it). Ran the dev server and curled `/editor` directly (no temporary page edits needed this time) — confirmed navbar, closed sidebar (`-translate-x-full`, `panel-left-open`), tab/button placeholder text, and the page's placeholder text all render with no server console errors.

## In Progress

- None.

## Next Up

- Pick the next feature spec — no `04-*.md` exists yet in `context/feature-specs/`. `/editor` is currently a standalone placeholder route with a hardcoded project title and no real canvas — once auth/projects/Prisma exist, decide whether `/editor` becomes the real project workspace route (per `project-overview.md`'s "user enters the project workspace") or gets replaced by a dynamic route (e.g. project-scoped), and thread the real project title through instead of the hardcoded one. Also still open: wiring the sidebar's "New Project" button and the dialog pattern into a real dialog.

## Open Questions

- `--primary-foreground` and `--accent-foreground` (in the 02-theme-tokens.md mapping) have no direct ui-context.md counterpart — ui-context.md defines surface/text/accent roles but not "text on an accent-colored surface". Proposed values (`#08080a` and `#00c8d4` respectively) are a judgment call pending design confirmation.
- 03-editor.md says "both tabs show empty placeholder state" for `ProjectSidebar` but never names the tabs. Used "Templates" and "Layers" as placeholder labels — "Templates" ties to the starter-template import feature in `project-overview.md`; "Layers" is an unconfirmed guess at a second grouping. Revisit/confirm the real tab set (and whether "Layers" is even a concept in this product) before wiring real content into them.
- `app/editor/layout.tsx` hardcodes `projectTitle="Untitled Project"` — there's no auth/project data layer yet to source a real title from. Revisit once project routes and Prisma models exist (see architecture.md's project ownership model).

## Architecture Decisions

- shadcn initialized with the `base-nova` preset and `@base-ui/react` primitives (not Radix) — this was already the state of the repo before this session; kept as-is since `components.json` matched shadcn's own defaults.
- `EditorNavbar` and `ProjectSidebar` are controlled components (sidebar open/closed state, project title, and close/toggle handlers are all props) rather than managing their own state — they're described in 03-editor.md as reusable chrome that later chapters will extend, and the toggle button lives in the navbar while the `isOpen` consumer is the sidebar, so the state has to be owned by whatever future component composes both.

## Session Notes

- `app/globals.css` had regressed to a bare `@import "tailwindcss";` (no theme block), which would have left every shadcn component referencing undefined CSS variables. Regenerated it via `npx shadcn init -d --no-reinstall` (had to confirm overwrite of `components.json`; diff showed no actual changes since it already matched the generated defaults). `components/ui/*`, `lib/utils.ts` were untouched by the regeneration.
- Before writing 02-theme-tokens.md, resolved three doc issues confirmed with the user: fixed `--bg-base` in `context/ui-context.md` from `#080898` (saturated blue) to `#08080a` (near-black, consistent with the surrounding surface steps); gave "Faint Text" its own variable `--text-faint: #5c5c68` instead of reusing `--text-secondary`; corrected `context/code-standards.md`'s Styling section, which listed example utility names (`bg-base`, `text-copy-primary`, etc.) that matched neither shadcn's variable names nor ui-context.md's own — it now points at shadcn's real names since the user confirmed the theme-tokens work should repoint shadcn's existing variables rather than introduce a new naming scheme.
- Tokens with no shadcn slot and no current consumer (`--ascent-ai`, `--ascent-ai-text`, `--state-success`, `--state-warning`, `--text-secondary`, `--text-faint`, `--border-subtle`) are intentionally left unwired per user decision — revisit once a component needs one.
