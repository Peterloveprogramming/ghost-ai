"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Collaborator {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
}

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  isOwner: boolean
}

/** How long the "Copied!" confirmation stays visible after copying the link. */
const COPIED_FEEDBACK_MS = 1500

/**
 * Share dialog opened from the editor navbar. Owners can invite/remove
 * collaborators by email and copy the project link; collaborators get a
 * read-only view of who has access.
 */
export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  isOwner,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[] | null>(
    null
  )
  const [email, setEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return

    let cancelled = false

    fetch(`/api/projects/${projectId}/collaborators`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { collaborators: Collaborator[] }) => {
        if (!cancelled) setCollaborators(data.collaborators)
      })
      .catch(() => {
        if (!cancelled) setCollaborators([])
      })

    return () => {
      cancelled = true
    }
  }, [open, projectId])

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) {
      setEmail("")
      setInviteError(null)
      setCopied(false)
    }
  }

  async function handleInvite() {
    const trimmed = email.trim()
    if (!trimmed || isInviting) return

    setIsInviting(true)
    setInviteError(null)
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = (await response.json()) as
        | { collaborator: Collaborator }
        | { error: string }

      if (!response.ok) {
        setInviteError(
          "error" in data ? data.error : "Could not invite this person"
        )
        return
      }

      if ("collaborator" in data) {
        setCollaborators((current) => [...(current ?? []), data.collaborator])
        setEmail("")
      }
    } finally {
      setIsInviting(false)
    }
  }

  async function handleRemove(collaboratorId: string) {
    if (removingId) return

    setRemovingId(collaboratorId)
    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" }
      )
      if (!response.ok) return

      setCollaborators((current) =>
        (current ?? []).filter((collaborator) => collaborator.id !== collaboratorId)
      )
    } finally {
      setRemovingId(null)
    }
  }

  async function handleCopyLink() {
    const link = `${window.location.origin}/editor/${projectId}`
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
    } catch {
      // Clipboard permission denied — nothing to fall back to.
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Invite collaborators by email and manage who has access."
              : "People with access to this project."}
          </DialogDescription>
        </DialogHeader>

        {isOwner ? (
          <form
            className="flex flex-col gap-1.5"
            onSubmit={(event) => {
              event.preventDefault()
              handleInvite()
            }}
          >
            <div className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="teammate@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isInviting}
                autoFocus
              />
              <Button type="submit" disabled={!email.trim() || isInviting}>
                {isInviting ? <Loader2 className="animate-spin" /> : "Invite"}
              </Button>
            </div>
            {inviteError ? (
              <p className="text-xs text-destructive">{inviteError}</p>
            ) : null}
          </form>
        ) : null}

        <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
          {collaborators === null ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Loading collaborators…
            </p>
          ) : collaborators.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No collaborators yet.
            </p>
          ) : (
            collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 hover:bg-muted/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {collaborator.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={collaborator.avatarUrl}
                      alt=""
                      className="size-8 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {(collaborator.name ?? collaborator.email)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm font-medium text-foreground">
                      {collaborator.name ?? collaborator.email}
                    </span>
                    {collaborator.name ? (
                      <span className="truncate text-xs text-muted-foreground">
                        {collaborator.email}
                      </span>
                    ) : null}
                  </div>
                </div>
                {isOwner ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${collaborator.email}`}
                    disabled={removingId === collaborator.id}
                    onClick={() => handleRemove(collaborator.id)}
                  >
                    <X />
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </div>

        {isOwner ? (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyLink}
              className="w-full sm:w-auto"
            >
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied!" : "Copy project link"}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
