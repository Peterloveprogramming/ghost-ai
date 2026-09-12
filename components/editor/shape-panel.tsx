"use client"

import type { DragEvent } from "react"
import { Circle, Cylinder, Diamond, Hexagon, Pill, Square } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  CANVAS_SHAPES,
  DEFAULT_SHAPE_SIZES,
  SHAPE_DRAG_MIME_TYPE,
  type CanvasShape,
  type CanvasShapeDragPayload,
} from "@/types/canvas"

const SHAPE_ICONS: Record<CanvasShape, LucideIcon> = {
  rectangle: Square,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
}

const SHAPE_LABELS: Record<CanvasShape, string> = {
  rectangle: "Rectangle",
  diamond: "Diamond",
  circle: "Circle",
  pill: "Pill",
  cylinder: "Cylinder",
  hexagon: "Hexagon",
}

// Floating bottom-center toolbar. Each button is a native drag source; the
// canvas wrapper reads the payload on drop to create a new node.
export function ShapePanel() {
  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-popover p-2 shadow-lg">
      {CANVAS_SHAPES.map((shape) => (
        <ShapePanelButton key={shape} shape={shape} />
      ))}
    </div>
  )
}

function ShapePanelButton({ shape }: { shape: CanvasShape }) {
  const Icon = SHAPE_ICONS[shape]
  const label = SHAPE_LABELS[shape]

  function handleDragStart(event: DragEvent<HTMLButtonElement>) {
    const size = DEFAULT_SHAPE_SIZES[shape]
    const payload: CanvasShapeDragPayload = { shape, width: size.width, height: size.height }
    event.dataTransfer.setData(SHAPE_DRAG_MIME_TYPE, JSON.stringify(payload))
    event.dataTransfer.effectAllowed = "copy"
  }

  return (
    <button
      type="button"
      draggable
      onDragStart={handleDragStart}
      aria-label={`Drag to add a ${label.toLowerCase()} shape`}
      title={label}
      className={cn(
        "flex size-9 shrink-0 cursor-grab items-center justify-center rounded-xl text-muted-foreground",
        "transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
      )}
    >
      <Icon className="size-4" />
    </button>
  )
}
