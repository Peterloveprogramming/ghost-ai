"use client"

import { useCallback, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { slugify } from "@/lib/slug"

export type ProjectDialogKind = "create" | "rename" | "delete"

/**
 * Minimal project shape the sidebar and dialogs consume. The full records are
 * fetched server-side (see `app/editor/layout.tsx`) and narrowed to this before
 * crossing into client components.
 */
export interface SidebarProject {
  id: string
  name: string
}

interface UseProjectActionsArgs {
  ownedProjects: SidebarProject[]
  sharedProjects: SidebarProject[]
}

/** Slug used when a name has no slug-safe characters yet. */
const UNTITLED_SLUG = "untitled"

/** Short, unique-enough suffix that keeps generated room ids readable. */
function generateSuffix(): string {
  return crypto.randomUUID().split("-")[0]
}

export interface ProjectActions {
  /** Currently open dialog, or `null` when every dialog is closed. */
  openDialog: ProjectDialogKind | null
  /** Project targeted by the rename/delete dialogs. `null` for create. */
  targetProject: SidebarProject | null
  /** Shared text field value for the create and rename dialogs. */
  name: string
  /** Room id preview shown in the create dialog: `<slug>-<suffix>`. */
  roomIdPreview: string
  /** True while a create/rename/delete request is in flight. */
  isSubmitting: boolean
  ownedProjects: SidebarProject[]
  sharedProjects: SidebarProject[]
  openCreate: () => void
  openRename: (project: SidebarProject) => void
  openDelete: (project: SidebarProject) => void
  closeDialog: () => void
  setName: (value: string) => void
  submitCreate: () => void
  submitRename: () => void
  submitDelete: () => void
}

/**
 * Owns the project dialog state and the create/rename/delete mutations against
 * the `/api/projects` routes. Initial project lists come from the server; each
 * successful mutation navigates or calls `router.refresh()` so the server data
 * re-flows in.
 */
export function useProjectActions({
  ownedProjects,
  sharedProjects,
}: UseProjectActionsArgs): ProjectActions {
  const router = useRouter()
  const params = useParams<{ roomId?: string }>()
  const activeRoomId =
    typeof params.roomId === "string" ? params.roomId : null

  const [openDialog, setOpenDialog] = useState<ProjectDialogKind | null>(null)
  const [targetProject, setTargetProject] = useState<SidebarProject | null>(null)
  const [name, setName] = useState("")
  const [suffix, setSuffix] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const roomIdPreview = useMemo(() => {
    const slug = slugify(name) || UNTITLED_SLUG
    return suffix ? `${slug}-${suffix}` : slug
  }, [name, suffix])

  const closeDialog = useCallback(() => {
    if (isSubmitting) return
    setOpenDialog(null)
    setTargetProject(null)
    setName("")
  }, [isSubmitting])

  const openCreate = useCallback(() => {
    setTargetProject(null)
    setName("")
    setSuffix(generateSuffix())
    setOpenDialog("create")
  }, [])

  const openRename = useCallback((project: SidebarProject) => {
    setTargetProject(project)
    setName(project.name)
    setOpenDialog("rename")
  }, [])

  const openDelete = useCallback((project: SidebarProject) => {
    setTargetProject(project)
    setName("")
    setOpenDialog("delete")
  }, [])

  const submitCreate = useCallback(async () => {
    const trimmed = name.trim()
    if (!trimmed || isSubmitting) return

    const slug = slugify(trimmed) || UNTITLED_SLUG
    // The project id and the Liveblocks room id are the same value.
    const roomId = `${slug}-${suffix || generateSuffix()}`

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roomId, name: trimmed }),
      })
      if (!response.ok) return

      const { project } = (await response.json()) as { project: { id: string } }
      setOpenDialog(null)
      setName("")
      router.push(`/editor/${project.id}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [name, suffix, isSubmitting, router])

  const submitRename = useCallback(async () => {
    const trimmed = name.trim()
    if (!trimmed || !targetProject || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/projects/${targetProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      })
      if (!response.ok) return

      setOpenDialog(null)
      setTargetProject(null)
      setName("")
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }, [name, targetProject, isSubmitting, router])

  const submitDelete = useCallback(async () => {
    if (!targetProject || isSubmitting) return
    const target = targetProject

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/projects/${target.id}`, {
        method: "DELETE",
      })
      if (!response.ok) return

      setOpenDialog(null)
      setTargetProject(null)
      if (activeRoomId === target.id) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [targetProject, isSubmitting, activeRoomId, router])

  return {
    openDialog,
    targetProject,
    name,
    roomIdPreview,
    isSubmitting,
    ownedProjects,
    sharedProjects,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    setName,
    submitCreate,
    submitRename,
    submitDelete,
  }
}
