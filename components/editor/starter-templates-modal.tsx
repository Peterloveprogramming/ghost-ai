"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StarterTemplatePreview } from "@/components/editor/starter-template-preview"
import { CANVAS_TEMPLATES, type CanvasTemplate } from "@/components/editor/starter-templates"

interface StarterTemplatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (template: CanvasTemplate) => void
}

// Opens as a dialog, lists every CANVAS_TEMPLATES entry as a card with a
// preview + import button. Selecting a template hands it to onImport and
// closes — the caller decides how the template actually reaches the canvas.
export function StarterTemplatesModal({ open, onOpenChange, onImport }: StarterTemplatesModalProps) {
  function handleImport(template: CanvasTemplate) {
    onImport(template)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Starter templates</DialogTitle>
          <DialogDescription>
            Start from a pre-built diagram instead of an empty canvas. Importing replaces
            everything currently on the canvas.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid gap-3 pr-2 sm:grid-cols-2">
            {CANVAS_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3"
              >
                <StarterTemplatePreview template={template} />
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">{template.name}</span>
                  <span className="text-xs text-muted-foreground">{template.description}</span>
                </div>
                <Button size="sm" onClick={() => handleImport(template)}>
                  Import
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
