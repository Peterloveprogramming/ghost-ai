"use client"

import { useCallback, useEffect, type DragEvent } from "react"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type EdgeChange,
  type NodeChange,
  type NodeTypes,
} from "@xyflow/react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import { useCanRedo, useCanUndo, useHistory } from "@liveblocks/react"

import { CanvasControlBar } from "@/components/editor/canvas-control-bar"
import { CanvasNodeActionsContext, CanvasShapeNode } from "@/components/editor/canvas-shape-node"
import { useCanvasTemplateImportRegistration } from "@/components/editor/canvas-template-import-context"
import { ShapePanel } from "@/components/editor/shape-panel"
import type { CanvasTemplate } from "@/components/editor/starter-templates"
import { createCanvasNodeId } from "@/lib/canvas-node-id"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
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
  const reactFlowInstance = useReactFlow<CanvasNode, CanvasEdge>()
  const { screenToFlowPosition, getNode } = reactFlowInstance
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  const history = useHistory()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  useKeyboardShortcuts({
    reactFlowInstance,
    onUndo: history.undo,
    onRedo: history.redo,
  })

  // Replaces the whole canvas with a starter template: removes every current
  // node/edge and adds the template's own (with freshly minted ids, so a
  // template can be imported more than once without id collisions), then
  // fits the view once the new nodes are on screen.
  const handleImportTemplate = useCallback(
    (template: CanvasTemplate) => {
      const removeNodeChanges: NodeChange<CanvasNode>[] = reactFlowInstance
        .getNodes()
        .map((existing) => ({ id: existing.id, type: "remove" }))
      const removeEdgeChanges: EdgeChange<CanvasEdge>[] = reactFlowInstance
        .getEdges()
        .map((existing) => ({ id: existing.id, type: "remove" }))

      const idMap = new Map<string, string>()
      const newNodes: CanvasNode[] = template.nodes.map((templateNode) => {
        const id = createCanvasNodeId(templateNode.data.shape)
        idMap.set(templateNode.id, id)
        return { ...templateNode, id }
      })
      const newEdges: CanvasEdge[] = template.edges.map((templateEdge) => {
        const source = idMap.get(templateEdge.source) ?? templateEdge.source
        const target = idMap.get(templateEdge.target) ?? templateEdge.target
        return { ...templateEdge, id: `${source}->${target}`, source, target }
      })

      onNodesChange([
        ...removeNodeChanges,
        ...newNodes.map((item): NodeChange<CanvasNode> => ({ type: "add", item })),
      ])
      onEdgesChange([
        ...removeEdgeChanges,
        ...newEdges.map((item): EdgeChange<CanvasEdge> => ({ type: "add", item })),
      ])

      requestAnimationFrame(() => reactFlowInstance.fitView({ duration: 200 }))
    },
    [reactFlowInstance, onNodesChange, onEdgesChange]
  )

  const { registerImportHandler } = useCanvasTemplateImportRegistration()
  useEffect(() => {
    registerImportHandler(handleImportTemplate)
    return () => registerImportHandler(null)
  }, [registerImportHandler, handleImportTemplate])

  // Node components can't receive arbitrary props from React Flow (only
  // NodeProps), so label edits reach this Liveblocks-backed onNodesChange
  // through CanvasNodeActionsContext instead.
  const handleLabelChange = useCallback(
    (id: string, label: string) => {
      const node = getNode(id)
      if (!node) return
      onNodesChange([{ id, type: "replace", item: { ...node, data: { ...node.data, label } } }])
    },
    [getNode, onNodesChange]
  )

  // Swatch selection from the node color toolbar — same Liveblocks-synced
  // "replace" change as the label edit above, just for `data.color`.
  const handleColorChange = useCallback(
    (id: string, color: string) => {
      const node = getNode(id)
      if (!node) return
      onNodesChange([{ id, type: "replace", item: { ...node, data: { ...node.data, color } } }])
    },
    [getNode, onNodesChange]
  )

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
    <CanvasNodeActionsContext.Provider
      value={{ onLabelChange: handleLabelChange, onColorChange: handleColorChange }}
    >
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
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
        <CanvasControlBar
          reactFlowInstance={reactFlowInstance}
          onUndo={history.undo}
          onRedo={history.redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <ShapePanel />
      </div>
    </CanvasNodeActionsContext.Provider>
  )
}
