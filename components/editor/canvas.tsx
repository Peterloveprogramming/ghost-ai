"use client"

import type { DragEvent } from "react"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeTypes,
} from "@xyflow/react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"

import { CanvasShapeNode } from "@/components/editor/canvas-shape-node"
import { ShapePanel } from "@/components/editor/shape-panel"
import { createCanvasNodeId } from "@/lib/canvas-node-id"
import {
  DEFAULT_NODE_COLOR,
  SHAPE_DRAG_MIME_TYPE,
  type CanvasEdge,
  type CanvasNode,
  type CanvasShapeDragPayload,
} from "@/types/canvas"

import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"

const nodeTypes: NodeTypes = { canvasNode: CanvasShapeNode }

// The shared architecture canvas: React Flow's view backed by Liveblocks
// Storage, so nodes/edges stay in sync across everyone in the room.
export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasFlow />
    </ReactFlowProvider>
  )
}

function CanvasFlow() {
  const { screenToFlowPosition } = useReactFlow<CanvasNode, CanvasEdge>()
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (!event.dataTransfer.types.includes(SHAPE_DRAG_MIME_TYPE)) return
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    const raw = event.dataTransfer.getData(SHAPE_DRAG_MIME_TYPE)
    if (!raw) return
    event.preventDefault()

    const payload = JSON.parse(raw) as CanvasShapeDragPayload
    const center = screenToFlowPosition({ x: event.clientX, y: event.clientY })

    const newNode: CanvasNode = {
      id: createCanvasNodeId(payload.shape),
      type: "canvasNode",
      position: { x: center.x - payload.width / 2, y: center.y - payload.height / 2 },
      width: payload.width,
      height: payload.height,
      data: { label: "", color: DEFAULT_NODE_COLOR, shape: payload.shape },
    }

    onNodesChange([{ type: "add", item: newNode }])
  }

  return (
    <div className="relative h-full w-full" onDragOver={handleDragOver} onDrop={handleDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
      <ShapePanel />
    </div>
  )
}
