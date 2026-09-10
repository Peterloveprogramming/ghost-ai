"use client"

import { createContext, useContext, type FormEvent, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  useProjectActions,
  type ProjectActions,
  type SidebarProject,
} from "@/hooks/use-project-actions"

const ProjectDialogsContext = createContext<ProjectActions | null>(null)

export function useProjectDialogsContext(): ProjectActions {
  const value = useContext(ProjectDialogsContext)
  if (!value) {
    throw new Error(
      "useProjectDialogsContext must be used within a ProjectDialogsProvider"
    )
  }
  return value
}

interface ProjectDialogsProviderProps {
  children: ReactNode
  ownedProjects: SidebarProject[]
  sharedProjects: SidebarProject[]
}

export function ProjectDialogsProvider({
  children,
  ownedProjects,
  sharedProjects,
}: ProjectDialogsProviderProps) {
  const value = useProjectActions({ ownedProjects, sharedProjects })

  return (
    <ProjectDialogsContext.Provider value={value}>
      {children}
      <CreateProjectDialog />
      <RenameProjectDialog />
      <DeleteProjectDialog />
    </ProjectDialogsContext.Provider>
  )
}

function CreateProjectDialog() {
  const {
    openDialog,
    name,
    roomIdPreview,
    isSubmitting,
    setName,
    closeDialog,
    submitCreate,
  } = useProjectDialogsContext()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submitCreate()
  }

  return (
    <Dialog
      open={openDialog === "create"}
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Start a new architecture workspace.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1.5">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Project name"
              autoComplete="off"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Room ID:{" "}
              <span className="font-mono text-foreground">{roomIdPreview}</span>
            </p>
          </div>
          <DialogFooter>
            <DialogClose
              render={<Button type="button" variant="outline" />}
              disabled={isSubmitting}
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? "Creating…" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RenameProjectDialog() {
  const {
    openDialog,
    targetProject,
    name,
    isSubmitting,
    setName,
    closeDialog,
    submitRename,
  } = useProjectDialogsContext()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submitRename()
  }

  return (
    <Dialog
      open={openDialog === "rename"}
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>
            Currently “{targetProject?.name}”.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <Input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Project name"
            autoComplete="off"
            disabled={isSubmitting}
          />
          <DialogFooter>
            <DialogClose
              render={<Button type="button" variant="outline" />}
              disabled={isSubmitting}
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteProjectDialog() {
  const {
    openDialog,
    targetProject,
    isSubmitting,
    closeDialog,
    submitDelete,
  } = useProjectDialogsContext()

  return (
    <Dialog
      open={openDialog === "delete"}
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This permanently deletes “{targetProject?.name}”. This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={<Button type="button" variant="outline" />}
            disabled={isSubmitting}
          >
            Cancel
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={submitDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
