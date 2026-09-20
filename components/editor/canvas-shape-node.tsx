"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react"
import { Handle, NodeResizer, NodeToolbar, Position, type NodeProps } from "@xyflow/react"

import { cn } from "@/lib/utils"
import { CanvasShapeVisual } from "@/components/editor/canvas-shape-visual"
import {
  DEFAULT_SHAPE_SIZES,
  MIN_SHAPE_SIZE,
  NODE_COLORS,
  type CanvasNode,
  type CanvasNodeColor,
} from "@/types/canvas"

interface CanvasNodeActions {
  onLabelChange: (id: string, label: string) => void
  onColorChange: (id: string, color: string) => void
}

// Default no-op so the node renderer never has to null-check the context —
// CanvasFlow always provides the real handler before any node can mount.
const CANVAS_NODE_ACTIONS_DEFAULT: CanvasNodeActions = {
  onLabelChange: () => {},
  onColorChange: () => {},
}

// Routes label edits from inside a node back into the Liveblocks-synced node
// state. A context (rather than a nodeTypes prop) because React Flow only
// ever passes NodeProps to a registered node type.
export const CanvasNodeActionsContext = createContext<CanvasNodeActions>(
  CANVAS_NODE_ACTIONS_DEFAULT
)

// Subtle border at rest, brand-teal ring when selected — both are existing
// theme tokens, not new hex values.
function borderColor(selected: boolean) {
  return selected ? "var(--ring)" : "var(--border)"
}

function borderWidth(selected: boolean) {
  return selected ? 2 : 1.5
}

// The custom renderer registered for the "canvasNode" React Flow type.
// rectangle/pill/circle are plain CSS boxes; diamond/hexagon/cylinder are
// SVG so they can have angled/curved outlines that scale with node size.
export function CanvasShapeNode({ id, data, width, height, selected }: NodeProps<CanvasNode>) {
  const { onLabelChange, onColorChange } = useContext(CanvasNodeActionsContext)
  const [isEditing, setIsEditing] = useState(false)
  const [draftLabel, setDraftLabel] = useState(data.label)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const textColor =
    NODE_COLORS.find((color) => color.fill === data.color)?.text ?? NODE_COLORS[0].text
  const size = DEFAULT_SHAPE_SIZES[data.shape]
  const w = width ?? size.width
  const h = height ?? size.height

  // A textarea always renders its text pinned to the top of its box, so
  // filling the whole node with one would leave typed text stuck above
  // center. Instead the textarea sits inside a centering flex wrapper and is
  // sized to its own content height on every change, keeping it (and the
  // text inside it) vertically centered like the resting label.
  function fitTextareaHeight(el: HTMLTextAreaElement | null) {
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
      textareaRef.current?.select()
      fitTextareaHeight(textareaRef.current)
    }
  }, [isEditing])

  function startEditing(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
    setDraftLabel(data.label)
    setIsEditing(true)
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDraftLabel(event.target.value)
    onLabelChange(id, event.target.value)
    fitTextareaHeight(event.target)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      setIsEditing(false)
    }
  }

  return (
    <div className="relative" style={{ width: w, height: h }}>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        offset={14}
        className="nodrag nopan flex items-center gap-1.5 rounded-full border border-border bg-popover p-1.5 shadow-lg"
      >
        {NODE_COLORS.map((color) => (
          <ColorSwatch
            key={color.fill}
            color={color}
            isActive={data.color === color.fill}
            onSelect={() => onColorChange(id, color.fill)}
          />
        ))}
      </NodeToolbar>
      <NodeResizer
        isVisible={selected}
        minWidth={MIN_SHAPE_SIZE.width}
        minHeight={MIN_SHAPE_SIZE.height}
        color="var(--ring)"
        handleClassName="!size-2 !rounded-[2px] !border !border-background !bg-ring"
        lineClassName="!border-ring/40"
      />
      <CanvasShapeVisual
        shape={data.shape}
        width={w}
        height={h}
        color={data.color}
        borderColor={borderColor(selected)}
        borderWidth={borderWidth(selected)}
      />
      {isEditing ? (
        <div className="absolute inset-0 flex items-center justify-center px-3">
          <textarea
            ref={textareaRef}
            value={draftLabel}
            onChange={handleChange}
            onBlur={() => setIsEditing(false)}
            onKeyDown={handleKeyDown}
            placeholder="Label"
            rows={1}
            className="nodrag nopan w-full resize-none overflow-hidden border-none bg-transparent text-center text-sm font-medium outline-none placeholder:opacity-55"
            style={{ color: textColor }}
          />
        </div>
      ) : (
        <div
          onDoubleClick={startEditing}
          className="absolute inset-0 flex items-center justify-center px-3 text-center text-sm font-medium break-words"
          style={{ color: textColor, opacity: data.label ? 1 : 0.55 }}
        >
          {data.label || "Label"}
        </div>
      )}
      <Handle
        id="top"
        type="target"
        position={Position.Top}
        className="!size-2 !border-none !bg-border"
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="!size-2 !border-none !bg-border"
      />
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="!size-2 !border-none !bg-border"
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="!size-2 !border-none !bg-border"
      />
    </div>
  )
}

// One swatch per NODE_COLORS pair. Active swatch gets a solid ring in its own
// text color; hovering any swatch shows a tight glow (also its text color) so
// the preview stays legible without a blurry halo.
function ColorSwatch({
  color,
  isActive,
  onSelect,
}: {
  color: CanvasNodeColor
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Set node color to ${color.text}`}
      aria-pressed={isActive}
      className={cn(
        "size-5 shrink-0 rounded-full border transition-transform hover:scale-110",
        "hover:[box-shadow:0_0_6px_1px_var(--swatch-glow)]",
        isActive ? "scale-110" : "border-border/60"
      )}
      style={{
        backgroundColor: color.fill,
        borderColor: isActive ? color.text : undefined,
        boxShadow: isActive ? `0 0 0 2px ${color.text}` : undefined,
        ["--swatch-glow" as string]: `${color.text}99`,
      }}
    />
  )
}
