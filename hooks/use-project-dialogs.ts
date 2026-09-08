"use client"

import { useCallback, useMemo, useState } from "react"

import { MOCK_PROJECTS, type MockProject } from "@/lib/mock-projects"
import { slugify } from "@/lib/slug"

export type ProjectDialogKind = "create" | "rename" | "delete"

/** Simulated persistence latency so the loading state is observable without an API. */
const MOCK_LATENCY_MS = 500

interface ProjectDialogsState {
  /** Currently open dialog, or `null` when every dialog is closed. */
  openDialog: ProjectDialogKind | null
  /** Project targeted by the rename/delete dialogs. `null` for the create dialog. */
  targetProject: MockProject | null
  /** Shared text field value for the create and rename dialogs. */
  name: string
  /** Live slug preview derived from `name`. */
  slugPreview: string
  /** True while a mock create/rename/delete is in flight. */
  isSubmitting: boolean
  /** Mock projects owned by the current user — these expose row actions. */
  ownedProjects: MockProject[]
  /** Mock projects shared with the current user — no row actions. */
  sharedProjects: MockProject[]
  openCreate: () => void
  openRename: (project: MockProject) => void
  openDelete: (project: MockProject) => void
  closeDialog: () => void
  setName: (value: string) => void
  submitCreate: () => void
  submitRename: () => void
  submitDelete: () => void
}

export function useProjectDialogs(): ProjectDialogsState {
  const [projects, setProjects] = useState<MockProject[]>(MOCK_PROJECTS)
  const [openDialog, setOpenDialog] = useState<ProjectDialogKind | null>(null)
  const [targetProject, setTargetProject] = useState<MockProject | null>(null)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const closeDialog = useCallback(() => {
    if (isSubmitting) return
    setOpenDialog(null)
    setTargetProject(null)
    setName("")
  }, [isSubmitting])

  const openCreate = useCallback(() => {
    setTargetProject(null)
    setName("")
    setOpenDialog("create")
  }, [])

  const openRename = useCallback((project: MockProject) => {
    setTargetProject(project)
    setName(project.name)
    setOpenDialog("rename")
  }, [])

  const openDelete = useCallback((project: MockProject) => {
    setTargetProject(project)
    setName("")
    setOpenDialog("delete")
  }, [])

  const runMockSubmit = useCallback((mutate: () => void) => {
    setIsSubmitting(true)
    window.setTimeout(() => {
      mutate()
      setIsSubmitting(false)
      setOpenDialog(null)
      setTargetProject(null)
      setName("")
    }, MOCK_LATENCY_MS)
  }, [])

  const submitCreate = useCallback(() => {
    const trimmed = name.trim()
    if (!trimmed || isSubmitting) return
    runMockSubmit(() => {
      setProjects((current) => [
        {
          id: `proj-${slugify(trimmed) || "untitled"}-${crypto.randomUUID()}`,
          name: trimmed,
          slug: slugify(trimmed),
          access: "owner",
        },
        ...current,
      ])
    })
  }, [name, isSubmitting, runMockSubmit])

  const submitRename = useCallback(() => {
    const trimmed = name.trim()
    if (!trimmed || !targetProject || isSubmitting) return
    const id = targetProject.id
    runMockSubmit(() => {
      setProjects((current) =>
        current.map((project) =>
          project.id === id
            ? { ...project, name: trimmed, slug: slugify(trimmed) }
            : project
        )
      )
    })
  }, [name, targetProject, isSubmitting, runMockSubmit])

  const submitDelete = useCallback(() => {
    if (!targetProject || isSubmitting) return
    const id = targetProject.id
    runMockSubmit(() => {
      setProjects((current) => current.filter((project) => project.id !== id))
    })
  }, [targetProject, isSubmitting, runMockSubmit])

  const ownedProjects = useMemo(
    () => projects.filter((project) => project.access === "owner"),
    [projects]
  )
  const sharedProjects = useMemo(
    () => projects.filter((project) => project.access === "collaborator"),
    [projects]
  )

  return {
    openDialog,
    targetProject,
    name,
    slugPreview: slugify(name),
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

export type { MockProject }
