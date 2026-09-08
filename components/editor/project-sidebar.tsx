"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { useProjectDialogsContext } from "@/components/editor/project-dialogs"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MockProject } from "@/hooks/use-project-dialogs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const { ownedProjects, sharedProjects, openCreate, openRename, openDelete } =
    useProjectDialogsContext()

  return (
    <>
      {isOpen && (
        <div
          aria-hidden
          onClick={onClose}
          className="fixed inset-x-0 top-14 bottom-0 z-30 bg-black/50 md:hidden"
        />
      )}

      <aside
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "fixed top-14 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-popover text-popover-foreground shadow-2xl transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
          <span className="truncate text-sm font-medium">Projects</span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close sidebar"
            onClick={onClose}
          >
            <X />
          </Button>
        </div>

        <Tabs
          defaultValue="projects"
          className="flex min-h-0 flex-1 flex-col px-3 pt-3"
        >
          <TabsList className="w-full">
            <TabsTrigger value="projects" className="flex-1">
              Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="min-h-0 flex-1 py-3">
            <ProjectList
              projects={ownedProjects}
              emptyLabel="No projects yet"
              onRename={openRename}
              onDelete={openDelete}
            />
          </TabsContent>

          <TabsContent value="shared" className="min-h-0 flex-1 py-3">
            <ProjectList
              projects={sharedProjects}
              emptyLabel="No shared projects yet"
            />
          </TabsContent>
        </Tabs>

        <div className="shrink-0 border-t border-border p-3">
          <Button className="w-full" onClick={openCreate}>
            <Plus />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}

interface ProjectListProps {
  projects: MockProject[]
  emptyLabel: string
  onRename?: (project: MockProject) => void
  onDelete?: (project: MockProject) => void
}

function ProjectList({
  projects,
  emptyLabel,
  onRename,
  onDelete,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    )
  }

  const showActions = Boolean(onRename && onDelete)

  return (
    <ul className="flex h-full flex-col gap-0.5 overflow-y-auto">
      {projects.map((project) => (
        <li
          key={project.id}
          className="group flex items-center gap-1 rounded-xl px-2 py-1.5 hover:bg-muted/50"
        >
          <span className="min-w-0 flex-1 truncate text-sm text-foreground">
            {project.name}
          </span>
          {showActions && project.access === "owner" && (
            <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Rename ${project.name}`}
                onClick={() => onRename?.(project)}
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Delete ${project.name}`}
                onClick={() => onDelete?.(project)}
              >
                <Trash2 />
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
