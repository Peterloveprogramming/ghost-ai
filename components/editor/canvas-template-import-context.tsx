"use client"

import { createContext, useContext } from "react"

import type { CanvasTemplate } from "@/components/editor/starter-templates"

export type CanvasTemplateImportHandler = (template: CanvasTemplate) => void

interface CanvasTemplateImportContextValue {
  registerImportHandler: (handler: CanvasTemplateImportHandler | null) => void
}

// Bridges the "open starter templates" trigger (navbar, owned by EditorShell)
// with the component that can actually perform the import (CanvasFlow, owned
// by whatever route renders inside EditorShell's children). EditorShell holds
// the current handler; CanvasFlow registers/unregisters itself as it mounts.
const CanvasTemplateImportContext = createContext<CanvasTemplateImportContextValue>({
  registerImportHandler: () => {},
})

export const CanvasTemplateImportProvider = CanvasTemplateImportContext.Provider

export function useCanvasTemplateImportRegistration() {
  return useContext(CanvasTemplateImportContext)
}
