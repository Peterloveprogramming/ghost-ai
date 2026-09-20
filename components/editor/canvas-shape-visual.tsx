import type { CanvasShape } from "@/types/canvas"

// Padding so a shape's stroke never gets clipped at the SVG viewBox edge.
const STROKE_INSET = 2

function diamondPath(width: number, height: number) {
  const inset = STROKE_INSET
  return `M ${width / 2} ${inset} L ${width - inset} ${height / 2} L ${width / 2} ${height - inset} L ${inset} ${height / 2} Z`
}

function hexagonPath(width: number, height: number) {
  const x = STROKE_INSET
  const y = STROKE_INSET
  const w = width - STROKE_INSET * 2
  const h = height - STROKE_INSET * 2
  return `M ${x + w * 0.25} ${y} L ${x + w * 0.75} ${y} L ${x + w} ${y + h / 2} L ${x + w * 0.75} ${y + h} L ${x + w * 0.25} ${y + h} L ${x} ${y + h / 2} Z`
}

// Classic two-arc-ellipse cylinder outline: a full ellipse for the top cap,
// straight sides, and a front-facing half-ellipse for the bottom.
function cylinderPath(width: number, height: number) {
  const x = STROKE_INSET
  const y = STROKE_INSET
  const w = width - STROKE_INSET * 2
  const h = height - STROKE_INSET * 2
  const rx = w / 2
  const ry = Math.min(h / 6, rx * 0.6)
  return `M ${x} ${y + ry} a ${rx} ${ry} 0 0 0 ${w} 0 a ${rx} ${ry} 0 0 0 ${-w} 0 l 0 ${h - ry * 2} a ${rx} ${ry} 0 0 0 ${w} 0 l 0 ${-(h - ry * 2)}`
}

const SVG_SHAPE_PATH: Record<"diamond" | "hexagon" | "cylinder", (width: number, height: number) => string> = {
  diamond: diamondPath,
  hexagon: hexagonPath,
  cylinder: cylinderPath,
}

interface CanvasShapeVisualProps {
  shape: CanvasShape
  width: number
  height: number
  color: string
  borderColor: string
  borderWidth: number
}

// Pure shape rendering shared by the canvas node renderer and the shape
// panel's drag-preview ghost — no React Flow or drag/drop dependency here.
export function CanvasShapeVisual({
  shape,
  width,
  height,
  color,
  borderColor,
  borderWidth,
}: CanvasShapeVisualProps) {
  if (shape === "diamond" || shape === "hexagon" || shape === "cylinder") {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block overflow-visible">
        <path d={SVG_SHAPE_PATH[shape](width, height)} fill={color} stroke={borderColor} strokeWidth={borderWidth} />
      </svg>
    )
  }

  const radiusClassName = shape === "pill" || shape === "circle" ? "rounded-full" : "rounded-xl"

  return (
    <div
      className={radiusClassName}
      style={{
        width,
        height,
        backgroundColor: color,
        borderStyle: "solid",
        borderWidth,
        borderColor,
      }}
    />
  )
}
