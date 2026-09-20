"use client"

import type { ReactNode } from "react"
import { AlertCircle, Check, Loader2, Minus, Plus, Redo2, Save, Scan, Undo2 } from "lucide-react"
import type { Edge, Node, ReactFlowInstance } from "@xyflow/react"

import type { CanvasSaveStatus } from "@/hooks/use-canvas-save"
import { cn } from "@/lib/utils"

const ZOOM_DURATION = 200

interface CanvasControlBarProps<NodeType extends Node, EdgeType extends Edge> {
  reactFlowInstance: ReactFlowInstance<NodeType, EdgeType> | null
  saveStatus: CanvasSaveStatus
  onSave: () => void
  saveDisabled?: boolean
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

// Floating pill bar, bottom-left, above the shape panel: zoom controls, a
// divider, Liveblocks undo/redo, then a manual Save button with its status.
export function CanvasControlBar<NodeType extends Node, EdgeType extends Edge>({
  reactFlowInstance,
  saveStatus,
  onSave,
  saveDisabled = false,
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

      <div className="mx-1 h-5 w-px bg-border" />

      <SaveButton status={saveStatus} onClick={onSave} disabled={saveDisabled} />
    </div>
  )
}

const SAVE_STATUS_COPY: Record<CanvasSaveStatus, string> = {
  idle: "Save",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
}

function SaveButton({
  status,
  onClick,
  disabled,
}: {
  status: CanvasSaveStatus
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || status === "saving"}
      aria-label={`Save canvas — ${SAVE_STATUS_COPY[status]}`}
      title={SAVE_STATUS_COPY[status]}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-xs font-medium transition-colors",
        disabled || status === "saving"
          ? "cursor-not-allowed opacity-40"
          : status === "error"
            ? "text-destructive hover:bg-destructive/10"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {status === "saving" ? (
        <Loader2 className="size-4 animate-spin" />
      ) : status === "error" ? (
        <AlertCircle className="size-4" />
      ) : status === "saved" ? (
        <Check className="size-4" />
      ) : (
        <Save className="size-4" />
      )}
      <span>{SAVE_STATUS_COPY[status]}</span>
    </button>
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
