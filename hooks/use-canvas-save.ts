"use client"

import { useCallback, useState } from "react"

import type { CanvasEdge, CanvasNode } from "@/types/canvas"

export type CanvasSaveStatus = "idle" | "saving" | "saved" | "error"

interface UseCanvasSaveOptions {
  projectId: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

// Manual canvas save: the user triggers a save via the Save button, nothing
// here saves automatically as nodes/edges change.
export function useCanvasSave({ projectId, nodes, edges }: UseCanvasSaveOptions) {
  const [status, setStatus] = useState<CanvasSaveStatus>("idle")

  const save = useCallback(async () => {
    setStatus("saving")
    try {
      const response = await fetch(`/api/projects/${projectId}/canvas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      })
      if (!response.ok) throw new Error("Canvas save failed")
      setStatus("saved")
    } catch {
      setStatus("error")
    }
  }, [projectId, nodes, edges])

  return { status, save }
}
