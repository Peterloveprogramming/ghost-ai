"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  projectTitle: string
  onClose: () => void
}

export function ProjectSidebar({
  isOpen,
  projectTitle,
  onClose,
}: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "fixed top-14 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-popover text-popover-foreground shadow-2xl transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
        <span className="truncate text-sm font-medium">{projectTitle}</span>
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
        defaultValue="templates"
        className="flex min-h-0 flex-1 flex-col px-3 pt-3"
      >
        <TabsList className="w-full">
          <TabsTrigger value="templates" className="flex-1">
            Templates
          </TabsTrigger>
          <TabsTrigger value="layers" className="flex-1">
            Layers
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="templates"
          className="flex flex-1 items-center justify-center text-sm text-muted-foreground"
        >
          No templates yet
        </TabsContent>
        <TabsContent
          value="layers"
          className="flex flex-1 items-center justify-center text-sm text-muted-foreground"
        >
          No layers yet
        </TabsContent>
      </Tabs>

      <div className="shrink-0 border-t border-border p-3">
        <Button className="w-full">
          <Plus />
          New Project
        </Button>
      </div>
    </aside>
  )
}
