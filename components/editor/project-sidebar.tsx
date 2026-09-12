"use client"

import Link from "next/link"
import { Pencil, Plus, Trash2, X } from "lucide-react"

import { useProjectDialogsContext } from "@/components/editor/project-dialogs"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SidebarProject } from "@/hooks/use-project-actions"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  /** Room id of the workspace currently open, highlighted in the list. */
  activeRoomId?: string | null
}

export function ProjectSidebar({
  isOpen,
  onClose,
  activeRoomId,
}: ProjectSidebarProps) {
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
          "fixed top-14 bottom-0 left-0 z-40 m-3 flex w-72 flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%+0.75rem)]"
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
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="min-h-0 flex-1 py-3">
            <ProjectList
              projects={ownedProjects}
              emptyLabel="No projects yet"
              activeRoomId={activeRoomId}
              onRename={openRename}
              onDelete={openDelete}
            />
          </TabsContent>

          <TabsContent value="shared" className="min-h-0 flex-1 py-3">
            <ProjectList
              projects={sharedProjects}
              emptyLabel="No shared projects yet"
              activeRoomId={activeRoomId}
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
  projects: SidebarProject[]
  emptyLabel: string
  activeRoomId?: string | null
  onRename?: (project: SidebarProject) => void
  onDelete?: (project: SidebarProject) => void
}

function ProjectList({
  projects,
  emptyLabel,
  activeRoomId,
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
      {projects.map((project) => {
        const isActive = project.id === activeRoomId
        return (
          <li
            key={project.id}
            className={cn(
              "group flex items-center gap-1 rounded-xl pr-1 transition-colors",
              isActive
                ? "bg-popover ring-1 ring-border"
                : "hover:bg-muted/50"
            )}
          >
            <Link
              href={`/editor/${project.id}`}
              aria-current={isActive ? "page" : undefined}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  isActive ? "bg-primary" : "bg-transparent"
                )}
              />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-sm text-foreground",
                  isActive && "font-medium"
                )}
              >
                {project.name}
              </span>
            </Link>
            {showActions && (
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
        )
      })}
    </ul>
  )
}
