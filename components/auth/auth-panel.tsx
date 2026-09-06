import type { ReactNode } from "react"
import { FileText, Ghost, Share2, Sparkles } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

interface AuthPanelProps {
  children: ReactNode
}

/**
 * Two-panel shell for the sign-in and sign-up routes. Large screens split 50/50:
 * a tinted left panel with the product pitch, and a right panel that centers the
 * Clerk form. Small screens render the form only.
 */
export function AuthPanel({ children }: AuthPanelProps) {
  return (
    <div className="flex min-h-screen w-full bg-background font-sans">
      <aside className="relative hidden w-1/2 flex-col justify-center overflow-hidden border-r border-border bg-card px-16 py-12 lg:flex">
        {/* Brand-tinted wash so the panel reads as a distinct surface, not the page background. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(115% 80% at 0% 0%, var(--accent), transparent 62%)",
          }}
        />

        <div className="relative flex max-w-md flex-col gap-10">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary">
              <Ghost className="size-5 text-primary-foreground" />
            </span>
            <span className="text-base font-semibold text-foreground">
              Ghost AI
            </span>
          </div>

          <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground">
              Design systems at the speed of thought.
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Describe your architecture in plain English. Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="flex flex-col gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">
                    {title}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </main>
    </div>
  )
}
