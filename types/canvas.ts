import type { Edge, Node } from "@xyflow/react"

// Node fill / text color pairs from context/ui-context.md's "Node Color
// Palette" — the only canvas colors nodes are allowed to use.
export interface CanvasNodeColor {
  fill: string
  text: string
}

export const NODE_COLORS: CanvasNodeColor[] = [
  { fill: "#1F1F1F", text: "#EDEDED" },
  { fill: "#10233D", text: "#52A8FF" },
  { fill: "#2E1938", text: "#BF7AF0" },
  { fill: "#331B00", text: "#FF990A" },
  { fill: "#3C1618", text: "#FF6166" },
  { fill: "#3A1726", text: "#F75F8F" },
  { fill: "#0F2E18", text: "#62C073" },
  { fill: "#062822", text: "#0AC7B4" },
]

// The shape vocabulary the bottom shape panel (context/feature-specs/12-shape-panel.md)
// offers. Every node created from the panel carries one of these.
export const CANVAS_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const

export type CanvasShape = (typeof CANVAS_SHAPES)[number]

export interface CanvasShapeSize {
  width: number
  height: number
}

// Sensible defaults per shape: rectangles wider than tall, circles square,
// diamonds sized up so a label has room inside the pointed corners.
export const DEFAULT_SHAPE_SIZES: Record<CanvasShape, CanvasShapeSize> = {
  rectangle: { width: 160, height: 80 },
  diamond: { width: 180, height: 140 },
  circle: { width: 100, height: 100 },
  pill: { width: 160, height: 56 },
  cylinder: { width: 120, height: 110 },
  hexagon: { width: 160, height: 100 },
}

// The neutral dark color from NODE_COLORS — used for every node dropped from
// the shape panel.
export const DEFAULT_NODE_COLOR = NODE_COLORS[0].fill

// Floor applied to every shape's resize handles, regardless of shape — below
// this a node's label has no room and handles become hard to grab.
export const MIN_SHAPE_SIZE: CanvasShapeSize = { width: 60, height: 40 }

// dataTransfer key the shape panel writes to and the canvas drop handler reads from.
export const SHAPE_DRAG_MIME_TYPE = "application/x-ghost-ai-shape"

export interface CanvasShapeDragPayload {
  shape: CanvasShape
  width: number
  height: number
}

export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  color: string
  shape: CanvasShape
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">

export type CanvasEdge = Edge<Record<string, never>, "canvasEdge">
