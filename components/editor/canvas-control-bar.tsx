"use client"

import type { ReactNode } from "react"
import { Minus, Plus, Redo2, Scan, Undo2 } from "lucide-react"
import type { Edge, Node, ReactFlowInstance } from "@xyflow/react"

import { cn } from "@/lib/utils"

const ZOOM_DURATION = 200

interface CanvasControlBarProps<NodeType extends Node, EdgeType extends Edge> {
  reactFlowInstance: ReactFlowInstance<NodeType, EdgeType> | null
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

// Floating pill bar, bottom-left, above the shape panel: zoom controls on the
// left, a divider, then Liveblocks undo/redo on the right.
export function CanvasControlBar<NodeType extends Node, EdgeType extends Edge>({
  reactFlowInstance,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: CanvasControlBarProps<NodeType, EdgeType>) {
  return (
    <div className="absolute bottom-20 left-4 z-10 flex items-center gap-1 rounded-full border border-border bg-popover p-2 shadow-lg">
      <ControlButton
        label="Zoom out"
        onClick={() => reactFlowInstance?.zoomOut({ duration: ZOOM_DURATION })}
      >
        <Minus className="size-4" />
      </ControlButton>
      <ControlButton
        label="Fit view"
        onClick={() => reactFlowInstance?.fitView({ duration: ZOOM_DURATION })}
      >
        <Scan className="size-4" />
      </ControlButton>
      <ControlButton
        label="Zoom in"
        onClick={() => reactFlowInstance?.zoomIn({ duration: ZOOM_DURATION })}
      >
        <Plus className="size-4" />
      </ControlButton>

      <div className="mx-1 h-5 w-px bg-border" />

      <ControlButton label="Undo" onClick={onUndo} disabled={!canUndo}>
        <Undo2 className="size-4" />
      </ControlButton>
      <ControlButton label="Redo" onClick={onRedo} disabled={!canRedo}>
        <Redo2 className="size-4" />
      </ControlButton>
    </div>
  )
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}
