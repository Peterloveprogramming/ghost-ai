"use client"

import { useEffect, useRef, useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)
  const wasSidebarOpen = useRef(false)

  useEffect(() => {
    if (wasSidebarOpen.current && !isSidebarOpen) {
      toggleButtonRef.current?.focus()
    }
    wasSidebarOpen.current = isSidebarOpen
  }, [isSidebarOpen])

  return (
    <ProjectDialogsProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          toggleButtonRef={toggleButtonRef}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex flex-1">{children}</div>
      </div>
    </ProjectDialogsProvider>
  )
}
