"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { useOthers } from "@liveblocks/react"

const MAX_VISIBLE_COLLABORATORS = 5
const AVATAR_SIZE_CLASS = "size-8"

// Top-right, canvas-only presence cluster: up to five collaborator avatars
// (Liveblocks presence, current user excluded) plus the existing Clerk
// UserButton for the signed-in user. Display-only — no click handlers.
export function PresenceAvatars() {
  const { user } = useUser()
  const others = useOthers()
  const collaborators = others.filter((other) => other.id !== user?.id)

  const visible = collaborators.slice(0, MAX_VISIBLE_COLLABORATORS)
  const overflowCount = collaborators.length - visible.length

  return (
    <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
      {collaborators.length > 0 ? (
        <>
          <div className="flex -space-x-2">
            {visible.map((other) => (
              <CollaboratorAvatar
                key={other.connectionId}
                name={other.info?.name}
                avatar={other.info?.avatar}
                color={other.info?.color}
              />
            ))}
            {overflowCount > 0 ? (
              <div
                className={`flex ${AVATAR_SIZE_CLASS} items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground ring-1 ring-border`}
              >
                +{overflowCount}
              </div>
            ) : null}
          </div>
          <div className="h-6 w-px bg-border" />
        </>
      ) : null}
      <UserButton appearance={{ elements: { avatarBox: AVATAR_SIZE_CLASS } }} />
    </div>
  )
}

function CollaboratorAvatar({
  name,
  avatar,
  color,
}: {
  name?: string
  avatar?: string
  color?: string
}) {
  return (
    <div
      className={`flex ${AVATAR_SIZE_CLASS} items-center justify-center overflow-hidden rounded-full border-2 border-background text-xs font-medium text-primary-foreground ring-1 ring-border`}
      style={{ backgroundColor: color ?? "var(--muted)" }}
      title={name}
    >
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="" className="h-full w-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}

function getInitials(name?: string): string {
  if (!name) return "?"
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
  return initials || "?"
}
