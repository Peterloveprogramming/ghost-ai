"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"

import { NODE_COLORS, type CanvasNode } from "@/types/canvas"

// Basic renderer for every canvas node: a bordered rectangle with the label
// centered, regardless of `data.shape`. Shape-specific outlines (diamond,
// circle, pill, cylinder, hexagon) come later.
export function CanvasShapeNode({ data, width, height }: NodeProps<CanvasNode>) {
  const textColor =
    NODE_COLORS.find((color) => color.fill === data.color)?.text ?? NODE_COLORS[0].text

  return (
    <div
      className="flex items-center justify-center rounded-md border border-border px-3 py-2 text-center text-sm font-medium break-words"
      style={{ width, height, backgroundColor: data.color, color: textColor }}
    >
      <Handle type="target" position={Position.Top} className="!size-2 !border-none !bg-border" />
      {data.label}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-2 !border-none !bg-border"
      />
    </div>
  )
}
