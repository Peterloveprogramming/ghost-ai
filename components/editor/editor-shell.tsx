"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "next/navigation"

import { AiChatPanel } from "@/components/editor/ai-chat-panel"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
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
  const toggleButtonRef = useRef<HTMLButtonElement>(null)
  const wasSidebarOpen = useRef(false)

  useEffect(() => {
    if (wasSidebarOpen.current && !isSidebarOpen) {
      toggleButtonRef.current?.focus()
    }
    wasSidebarOpen.current = isSidebarOpen
  }, [isSidebarOpen])

  return (
    <ProjectDialogsProvider
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    >
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
          {isWorkspace ? <AiChatPanel open={isAiPanelOpen} /> : null}
        </div>
        {isWorkspace && activeRoomId ? (
          <ShareDialog
            open={isShareOpen}
            onOpenChange={setIsShareOpen}
            projectId={activeRoomId}
            isOwner={isOwner}
          />
        ) : null}
      </div>
    </ProjectDialogsProvider>
  )
}
