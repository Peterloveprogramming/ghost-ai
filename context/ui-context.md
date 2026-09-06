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

- [Pattern — e.g. Editor: full-viewport split with
  left sidebar, center canvas, right sidebar]
- [Pattern — e.g. Sidebars: fixed width with border separator]
- [Pattern — e.g. Modals: centered overlay with backdrop blur]
- [Pattern — e.g. Navbar: top bar with bottom border]

## Icons

[e.g. Lucide React. Stroke-based icons only. Sizes:
h-4 w-4 for inline, h-5 w-5 for buttons.]
