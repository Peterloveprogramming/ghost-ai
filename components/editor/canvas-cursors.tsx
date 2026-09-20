"use client"

import { MousePointer2 } from "lucide-react"
import { useOthers } from "@liveblocks/react"
import { useViewport } from "@xyflow/react"

// Renders every other participant's cursor (never the current user's) on top
// of the canvas. Presence stores cursor position in flow coordinates, so it
// stays anchored to canvas content — this projects it back to screen space
// using the local viewport (pan + zoom) before rendering.
export function CanvasCursors() {
  const others = useOthers()
  const { x: viewportX, y: viewportY, zoom } = useViewport()

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {others.map((other) => {
        const cursor = other.presence.cursor
        if (!cursor) return null

        const color = other.info?.color ?? "var(--muted-foreground)"
        const left = cursor.x * zoom + viewportX
        const top = cursor.y * zoom + viewportY

        return (
          <div
            key={other.connectionId}
            className="absolute flex items-center gap-1 transition-transform duration-75 ease-linear"
            style={{ transform: `translate(${left}px, ${top}px)` }}
          >
            <MousePointer2 className="size-4 -translate-x-0.5 -translate-y-0.5" style={{ color, fill: color }} />
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary-foreground shadow"
              style={{ backgroundColor: color }}
            >
              {other.info?.name ?? "Guest"}
            </span>
          </div>
        )
      })}
    </div>
  )
}
