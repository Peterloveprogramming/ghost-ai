import { CanvasShapeVisual } from "@/components/editor/canvas-shape-visual"
import type { CanvasTemplate } from "@/components/editor/starter-templates"

const PREVIEW_WIDTH = 240
const PREVIEW_HEIGHT = 140
const PREVIEW_PADDING = 12

// Bounds come straight from each node's stored position/width/height — no
// React Flow instance is involved, this is plain arithmetic + CSS/SVG.
function getTemplateBounds(template: CanvasTemplate) {
  const minX = Math.min(...template.nodes.map((node) => node.position.x))
  const minY = Math.min(...template.nodes.map((node) => node.position.y))
  const maxX = Math.max(...template.nodes.map((node) => node.position.x + (node.width ?? 0)))
  const maxY = Math.max(...template.nodes.map((node) => node.position.y + (node.height ?? 0)))
  return { minX, minY, width: Math.max(maxX - minX, 1), height: Math.max(maxY - minY, 1) }
}

// Lightweight, static rendering of a template's nodes/edges scaled to fit a
// fixed-size viewport. Edges are plain lines between node centers; nodes use
// the same shape/color rendering the real canvas nodes use.
export function StarterTemplatePreview({ template }: { template: CanvasTemplate }) {
  const bounds = getTemplateBounds(template)
  const availableWidth = PREVIEW_WIDTH - PREVIEW_PADDING * 2
  const availableHeight = PREVIEW_HEIGHT - PREVIEW_PADDING * 2
  const scale = Math.min(availableWidth / bounds.width, availableHeight / bounds.height, 1)

  const offsetX = PREVIEW_PADDING + (availableWidth - bounds.width * scale) / 2
  const offsetY = PREVIEW_PADDING + (availableHeight - bounds.height * scale) / 2

  function toViewport(x: number, y: number) {
    return { x: offsetX + (x - bounds.minX) * scale, y: offsetY + (y - bounds.minY) * scale }
  }

  function nodeCenter(nodeId: string) {
    const node = template.nodes.find((candidate) => candidate.id === nodeId)
    if (!node) return null
    return toViewport(node.position.x + (node.width ?? 0) / 2, node.position.y + (node.height ?? 0) / 2)
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-border bg-background"
      style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
    >
      <svg
        width={PREVIEW_WIDTH}
        height={PREVIEW_HEIGHT}
        className="absolute inset-0"
        viewBox={`0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}`}
      >
        {template.edges.map((edge) => {
          const source = nodeCenter(edge.source)
          const target = nodeCenter(edge.target)
          if (!source || !target) return null
          return (
            <line
              key={edge.id}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="var(--border)"
              strokeWidth={1}
            />
          )
        })}
      </svg>
      {template.nodes.map((node) => {
        const position = toViewport(node.position.x, node.position.y)
        const width = (node.width ?? 0) * scale
        const height = (node.height ?? 0) * scale
        return (
          <div key={node.id} className="absolute" style={{ left: position.x, top: position.y }}>
            <CanvasShapeVisual
              shape={node.data.shape}
              width={width}
              height={height}
              color={node.data.color}
              borderColor="var(--border)"
              borderWidth={1}
            />
          </div>
        )
      })}
    </div>
  )
}
