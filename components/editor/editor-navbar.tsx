"use client"

import { UserButton } from "@clerk/nextjs"
import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react"
import type { RefObject } from "react"

import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  toggleButtonRef: RefObject<HTMLButtonElement | null>
  /** Current project name, shown next to the toggle while inside a room. */
  projectName?: string | null
  /** Whether to show the room-only actions (share, AI panel toggle). */
  showWorkspaceActions?: boolean
  isAiPanelOpen?: boolean
  onToggleAiPanel?: () => void
  onShare?: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  toggleButtonRef,
  projectName,
  showWorkspaceActions = false,
  isAiPanelOpen = false,
  onToggleAiPanel,
  onShare,
}: EditorNavbarProps) {
  return (
    <nav className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          ref={toggleButtonRef}
          variant="ghost"
          size="icon"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          onClick={onToggleSidebar}
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>

        {projectName ? (
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold text-foreground">
              {projectName}
            </span>
            <span className="text-xs text-muted-foreground">Workspace</span>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {showWorkspaceActions ? (
          <>
            <Button
              variant="outline"
              size="sm"
              aria-label="Share project"
              onClick={onShare}
            >
              <Share2 />
              Share
            </Button>
            <Button
              variant={isAiPanelOpen ? "default" : "outline"}
              size="sm"
              aria-label={isAiPanelOpen ? "Hide AI panel" : "Show AI panel"}
              aria-pressed={isAiPanelOpen}
              onClick={onToggleAiPanel}
            >
              <Sparkles />
              AI
            </Button>
          </>
        ) : null}
        <UserButton />
      </div>
    </nav>
  )
}
