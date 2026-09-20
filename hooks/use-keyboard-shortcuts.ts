import { useEffect } from "react"
import type { Edge, Node, ReactFlowInstance } from "@xyflow/react"

const ZOOM_DURATION = 200

interface UseKeyboardShortcutsOptions<NodeType extends Node, EdgeType extends Edge> {
  reactFlowInstance: ReactFlowInstance<NodeType, EdgeType> | null
  onUndo: () => void
  onRedo: () => void
}

// An editable target is any element the browser lets you type into —
// shortcuts must not fire while the user is typing a node label or a form field.
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
}

// Listens for canvas-wide shortcuts on `window`: zoom in/out and Liveblocks
// undo/redo. Ignored entirely while an editable field has focus.
export function useKeyboardShortcuts<NodeType extends Node, EdgeType extends Edge>({
  reactFlowInstance,
  onUndo,
  onRedo,
}: UseKeyboardShortcutsOptions<NodeType, EdgeType>) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return

      const isModifier = event.metaKey || event.ctrlKey

      if (isModifier && event.key.toLowerCase() === "z" && event.shiftKey) {
        event.preventDefault()
        onRedo()
        return
      }

      if (isModifier && event.key.toLowerCase() === "z") {
        event.preventDefault()
        onUndo()
        return
      }

      if (isModifier && event.key.toLowerCase() === "y") {
        event.preventDefault()
        onRedo()
        return
      }

      if (!isModifier && (event.key === "+" || event.key === "=")) {
        event.preventDefault()
        reactFlowInstance?.zoomIn({ duration: ZOOM_DURATION })
        return
      }

      if (!isModifier && event.key === "-") {
        event.preventDefault()
        reactFlowInstance?.zoomOut({ duration: ZOOM_DURATION })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [reactFlowInstance, onUndo, onRedo])
}
