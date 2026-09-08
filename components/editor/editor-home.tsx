"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useProjectDialogsContext } from "@/components/editor/project-dialogs"

export function EditorHome() {
  const { openCreate } = useProjectDialogsContext()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-medium text-foreground">
          Create a project or open an existing one.
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Start a new architecture workspace or choose a project from the
          sidebar.
        </p>
      </div>
      <Button size="icon" aria-label="New project" onClick={openCreate}>
        <Plus />
      </Button>
    </div>
  )
}
