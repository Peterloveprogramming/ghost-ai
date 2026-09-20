"use client"

import { useRef, type DragEvent, type MutableRefObject } from "react"
import { Circle, Cylinder, Diamond, Hexagon, Pill, Square } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { CanvasShapeVisual } from "@/components/editor/canvas-shape-visual"
import {
  CANVAS_SHAPES,
  DEFAULT_NODE_COLOR,
  DEFAULT_SHAPE_SIZES,
  SHAPE_DRAG_MIME_TYPE,
  type CanvasShape,
  type CanvasShapeDragPayload,
} from "@/types/canvas"

type PreviewRefs = MutableRefObject<Map<CanvasShape, HTMLDivElement>>

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
  const previewRefs = useRef(new Map<CanvasShape, HTMLDivElement>())

  return (
    <>
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-popover p-2 shadow-lg">
        {CANVAS_SHAPES.map((shape) => (
          <ShapePanelButton key={shape} shape={shape} previewRefs={previewRefs} />
        ))}
      </div>
      <ShapeDragPreviews previewRefs={previewRefs} />
    </>
  )
}

// Offscreen ghosts, one per shape, sized and colored exactly like a node
// dropped from the panel would be. The browser attaches whichever one is
// handed to `setDragImage` to the cursor for the duration of the drag and
// discards it automatically on drop or cancel — no manual show/hide needed.
function ShapeDragPreviews({ previewRefs }: { previewRefs: PreviewRefs }) {
  return (
    <div aria-hidden className="pointer-events-none fixed top-[-9999px] left-[-9999px]">
      {CANVAS_SHAPES.map((shape) => {
        const size = DEFAULT_SHAPE_SIZES[shape]
        return (
          <div
            key={shape}
            ref={(node) => {
              if (node) previewRefs.current.set(shape, node)
              else previewRefs.current.delete(shape)
            }}
          >
            <CanvasShapeVisual
              shape={shape}
              width={size.width}
              height={size.height}
              color={DEFAULT_NODE_COLOR}
              borderColor="var(--border)"
              borderWidth={1.5}
            />
          </div>
        )
      })}
    </div>
  )
}

function ShapePanelButton({ shape, previewRefs }: { shape: CanvasShape; previewRefs: PreviewRefs }) {
  const Icon = SHAPE_ICONS[shape]
  const label = SHAPE_LABELS[shape]

  function handleDragStart(event: DragEvent<HTMLButtonElement>) {
    const size = DEFAULT_SHAPE_SIZES[shape]
    const payload: CanvasShapeDragPayload = { shape, width: size.width, height: size.height }
    event.dataTransfer.setData(SHAPE_DRAG_MIME_TYPE, JSON.stringify(payload))
    event.dataTransfer.effectAllowed = "copy"

    const preview = previewRefs.current.get(shape)
    if (preview) {
      event.dataTransfer.setDragImage(preview, size.width / 2, size.height / 2)
    }
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
