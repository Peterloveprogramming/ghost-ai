"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "next/navigation"

import { AiSidebar } from "@/components/editor/ai-sidebar"
import {
  CanvasTemplateImportProvider,
  type CanvasTemplateImportHandler,
} from "@/components/editor/canvas-template-import-context"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal"
import type { CanvasTemplate } from "@/components/editor/starter-templates"
import type { SidebarProject } from "@/hooks/use-project-actions"
import { cn } from "@/lib/utils"

interface EditorShellProps {
  children: React.ReactNode
  ownedProjects: SidebarProject[]
  sharedProjects: SidebarProject[]
}

export function EditorShell({
  children,
  ownedProjects,
  sharedProjects,
}: EditorShellProps) {
  const params = useParams<{ roomId?: string }>()
  const activeRoomId =
    typeof params.roomId === "string" ? params.roomId : null

  // A room is only "active" once we can match it to a project the user can
  // reach; missing / forbidden rooms fall through to the page's AccessDenied.
  const activeProject = useMemo(() => {
    if (!activeRoomId) return null
    return (
      [...ownedProjects, ...sharedProjects].find(
        (project) => project.id === activeRoomId
      ) ?? null
    )
  }, [activeRoomId, ownedProjects, sharedProjects])
  const isWorkspace = activeProject !== null
  const isOwner = ownedProjects.some((project) => project.id === activeRoomId)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)
  const wasSidebarOpen = useRef(false)

  // The canvas that can actually import a template lives inside `children`
  // (a different subtree than the navbar button that opens this modal), so
  // the current CanvasFlow instance registers its import handler here.
  const importHandlerRef = useRef<CanvasTemplateImportHandler | null>(null)
  const registerImportHandler = useCallback((handler: CanvasTemplateImportHandler | null) => {
    importHandlerRef.current = handler
  }, [])
  const templateImportContextValue = useMemo(() => ({ registerImportHandler }), [registerImportHandler])

  useEffect(() => {
    if (wasSidebarOpen.current && !isSidebarOpen) {
      toggleButtonRef.current?.focus()
    }
    wasSidebarOpen.current = isSidebarOpen
  }, [isSidebarOpen])

  function handleImportTemplate(template: CanvasTemplate) {
    importHandlerRef.current?.(template)
  }

  return (
    <ProjectDialogsProvider
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    >
      <CanvasTemplateImportProvider value={templateImportContextValue}>
        <div className="flex h-dvh flex-col overflow-hidden bg-background">
          <EditorNavbar
            isSidebarOpen={isSidebarOpen}
            toggleButtonRef={toggleButtonRef}
            onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
            projectName={activeProject?.name ?? null}
            showWorkspaceActions={isWorkspace}
            isAiPanelOpen={isAiPanelOpen}
            onToggleAiPanel={() => setIsAiPanelOpen((open) => !open)}
            onShare={() => setIsShareOpen(true)}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
          />
          <ProjectSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            activeRoomId={activeRoomId}
          />
          <div
            className={cn(
              "flex min-h-0 flex-1 transition-[padding] duration-200 ease-in-out",
              isSidebarOpen && "md:pl-80"
            )}
          >
            {children}
            {isWorkspace ? (
              <AiSidebar
                open={isAiPanelOpen}
                onClose={() => setIsAiPanelOpen(false)}
              />
            ) : null}
          </div>
          {isWorkspace && activeRoomId ? (
            <ShareDialog
              open={isShareOpen}
              onOpenChange={setIsShareOpen}
              projectId={activeRoomId}
              isOwner={isOwner}
            />
          ) : null}
          {isWorkspace ? (
            <StarterTemplatesModal
              open={isTemplatesOpen}
              onOpenChange={setIsTemplatesOpen}
              onImport={handleImportTemplate}
            />
          ) : null}
        </div>
      </CanvasTemplateImportProvider>
    </ProjectDialogsProvider>
  )
}
