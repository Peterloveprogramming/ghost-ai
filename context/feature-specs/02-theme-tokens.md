Read `AGENTS.md` before starting

We are wiring the real design tokens from `context/ui-context.md`
into `app/globals.css`, replacing the shadcn-generated placeholder
values now that dark mode is confirmed working end to end
(`01-design-system.md`).

`html` always carries the `dark` class (`app/layout.tsx`), so the
`:root` (light) block is never active. Only edit the `.dark` block —
leave `:root` exactly as shadcn generated it.

Keep the existing shadcn variable names (`--background`, `--card`,
`--primary`, etc.) — do not rename them or introduce a parallel
naming scheme. Components already consume these names via Tailwind
utilities (`bg-background`, `text-foreground`, ...); this increment
only repoints their values.

Repoint these variables inside `.dark` in `app/globals.css`:

| shadcn variable       | ui-context.md source     | value                     |
| ---------------------- | ------------------------- | -------------------------- |
| `--background`         | `--bg-base`               | `#08080a`                  |
| `--foreground`         | `--text-primary`          | `#f0f0f4`                  |
| `--card`                | `--bg-surface`            | `#111114`                  |
| `--card-foreground`     | `--text-primary`          | `#f0f0f4`                  |
| `--popover`             | `--bg-elevated`           | `#18181c`                  |
| `--popover-foreground`  | `--text-primary`          | `#f0f0f4`                  |
| `--primary`             | `--ascent-primary`        | `#00c8d4`                  |
| `--primary-foreground`  | `--bg-base`               | `#08080a`                  |
| `--secondary`           | `--bg-subtle`             | `#1e1e23`                  |
| `--secondary-foreground`| `--text-primary`          | `#f0f0f4`                  |
| `--muted`               | `--bg-subtle`             | `#1e1e23`                  |
| `--muted-foreground`    | `--text-muted`            | `#808090`                  |
| `--accent`              | `--ascent-primary-dim`    | `rgba(0,200,212,0.12)`     |
| `--accent-foreground`   | `--ascent-primary`        | `#00c8d4`                  |
| `--destructive`         | `--state-error`           | `#ff4d4f`                  |
| `--border`              | `--border-default`        | `#2a2a30`                  |
| `--input`               | `--border-default`        | `#2a2a30`                  |
| `--ring`                | `--ascent-primary`        | `#00c8d4`                  |

`--primary-foreground` and `--accent-foreground` have no direct
ui-context.md counterpart (the doc defines surface/text/accent roles,
not "text on an accent-colored surface"). Values above are proposed
for contrast against their paired background — confirm/adjust in
`context/ui-context.md` if design intends something else.

Leave `--chart-1` through `--chart-5` and `--sidebar-*` at their
generated defaults — nothing in the app renders a chart or sidebar
yet, so there is no ui-context.md value to map them to.

Leave unmapped for this increment — no current shadcn slot and no
consumer yet: `--ascent-ai`, `--ascent-ai-text`, `--state-success`,
`--state-warning`, `--text-secondary`, `--text-faint`,
`--border-subtle`. Revisit in a later increment once a component
actually needs one of these.

Do not modify `components/ui/*`.

### check when done

- `npm run build` passes
- `npm run dev` renders the home page with the near-black background,
  teal primary accents, and no leftover shadcn gray/oklch neutral tones
- Every installed component (Button, Card, Dialog, Input, Tabs,
  Textarea, ScrollArea) still renders without console errors
- The `:root` (light) block is unchanged
