import { Bot, Sparkles } from "lucide-react"

interface AiChatPanelProps {
  /** Whether the panel is visible; toggled from the navbar. */
  open: boolean
}

/**
 * Right-hand workspace sidebar. Placeholder only — the real AI chat surface,
 * prompt composer, and run status attach here in a later step. Rendered beside
 * the canvas and toggled from the editor navbar.
 */
export function AiChatPanel({ open }: AiChatPanelProps) {
  if (!open) {
    return null
  }

  return (
    <aside className="my-3 mr-3 flex w-80 shrink-0 flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">
            AI Copilot
          </span>
          <span className="text-xs text-muted-foreground">Placeholder panel</span>
        </div>
        <Sparkles className="size-4 shrink-0 text-ai-foreground" />
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="flex gap-3 rounded-2xl border border-border bg-popover p-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-ai/15 text-ai-foreground">
            <Bot className="size-4" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">
              Chat surface pending
            </span>
            <p className="text-xs text-muted-foreground">
              The toggle is wired. Messaging and generation are intentionally out
              of scope here.
            </p>
          </div>
        </div>

        <div className="mt-auto rounded-2xl border border-dashed border-border p-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Future hooks
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Prompt composer, run status, and architecture guidance will attach to
            this sidebar.
          </p>
        </div>
      </div>
    </aside>
  )
}
