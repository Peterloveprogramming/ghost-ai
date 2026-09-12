# UI Context

## Theme

 Dark only.
No light mode. The design language is a dark technical
workspace — near-black backgrounds, layered surfaces,
and vivid accent colors for interactive elements.

## Colors

colors are defined as CSS custom properties in `global.css` and mapped to Tailwind tokens via `@theme inline` Components must use these tokens - no hard-coded token, no hard-coded hex values, or raw Tailwind color classes like `zinc-*`

| Role            | CSS Variable       | Value    |
| --------------- | ------------------ | -------- |
| Page background | `--bg-base`        | `#08080a` |
| Surface         | `--bg-surface`     | `#111114` |
| Elevated Surface    | `--bg-elevated`   | `#18181c` |
| Subtle Surface      | `--bg-subtle`     | `#1e1e23` |
| Default Border  | `--border-default` | `#2a2a30` |
| Subtle Border    |  `--border-subtle` | `#3a3a42` |
| Primary Text           | `--text-primary`    | `#f0f0f4` |
| Secondary Text          | `--text-secondary`  | `#c0c0cc` |
| Muted Text          | `--text-muted`  | `#808090` |
| Faint Text          | `--text-faint`  | `#5c5c68` |
| Brand Ascent          | `--ascent-primary`  | `#00c8d4` |
| Brand Dim          | `--ascent-primary-dim`  | `rgba(0,200,212,0.12)` |
| AI Ascent          | `--ascent-ai`  | `#6457f9` |
| AI text          | `--ascent-ai-text`  | `#8b82ff` |
| Error          | `--state-error`  | `#ff4d4f` |
| Success          | `--state-success`  | `#34d399` |
| Warning          | `--state-warning`  | `#fbbf24` |

## Typography

| Role      | Font              | Variable      |
| --------- | ----------------- | ------------- |
| UI text   | Geist Sans | `--font-geist-sans` |
| Code/mono | Geist Mono | `--font-geist-mono` |

both fonts are loaded via next/font/google and applied as CSS variable on the <html> element. The base `body` uses Geist Sans with `antialiased`.

## Border Radius

| Context           | Class            |
| ----------------- | ---------------- |
| Inline / small UI | `rounded-xl` |
| Cards / panels    | `rounded-2xl` |
| Modals / overlays | `rounded-3xl` |

radius increases with surface depth: smaller for inner elements, larger for outer containers.

## Canvas 

### Node Color Palette

8 defined color pairs. Each pair specifies the dark node fill and a vivid contrasting text color tuned for readability on the dark canvas. Defined in `types/canvas.ts` as `NODE_COLORS`

| Node fill | Text Color | Character              |
| --------- | ---------- | ----------------------- |
| #1F1F1F   | #EDEDED    | Neutral dark (default)  |
| #10233D   | #52A8FF    | Blue                    |
| #2E1938   | #BF7AF0    | Purple                  |
| #331B00   | #FF990A    | Orange                  |
| #3C1618   | #FF6166    | Red                     |
| #3A1726   | #F75F8F    | Pink                    |
| #0F2E18   | #62C073    | Green                   |
| #062822   | #0AC7B4    | Teal                    |

## Layout Patterns

- Editor shell: full-viewport (`h-dvh`, `overflow-hidden`) column — fixed
  `h-14` navbar on top, then a `flex-1 min-h-0` row holding the routed content.
- Navbar: top bar, `bg-card` with `border-b`. Left group = sidebar toggle +
  (in a room) project name with a "Workspace" sub-label. Right group =
  room-only actions (Share, AI-panel toggle) + Clerk `UserButton`.
- Project sidebar: floating rounded card (`fixed`, `m-3`, `rounded-2xl`,
  `bg-popover`), slides in/out via `translate-x`. Mobile gets a `bg-black/50`
  scrim; on `md+` the content row pads left (`md:pl-80`) so nothing overlaps.
- Workspace panels: the canvas and the right AI panel are floating rounded
  cards (`rounded-3xl`, `border-border`, `bg-card`) with a consistent `12px`
  (`p-3` / `m-3`) gutter. Canvas fills remaining space; AI panel is `w-80`
  and toggled from the navbar.
- Modals / dialogs: shadcn `Dialog` primitive, centered overlay.

## Icons

Lucide React, stroke-based only. `size-4` (h-4 w-4) inline and inside buttons
(the shadcn `Button` auto-sizes bare `svg` children to `size-4`); `size-5`–
`size-6` for standalone icon chips / empty-state badges. AI-related icons use
the `text-ai-foreground` token.
