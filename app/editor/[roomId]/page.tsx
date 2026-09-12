import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { CanvasRoom } from "@/components/editor/canvas-room"
import { findAccessibleProject, getCurrentIdentity } from "@/lib/project-access"

/**
 * Collaborative workspace shell for a single room (room id == project id).
 * Server component: it verifies the signed-in user may open this project before
 * any workspace chrome renders. The real-time canvas itself is client-side
 * (Liveblocks room + React Flow); AI chat and sharing arrive in later steps.
 */
export default async function EditorRoomPage({
  params,
}: PageProps<"/editor/[roomId]">) {
  const { roomId } = await params

  const identity = await getCurrentIdentity()
  if (!identity) {
    redirect("/sign-in")
  }

  const project = await findAccessibleProject(roomId, identity)
  if (!project) {
    return <AccessDenied />
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col p-3">
      <div className="relative flex flex-1 overflow-hidden rounded-3xl border border-border bg-card">
        <CanvasRoom roomId={roomId} />
      </div>
    </section>
  )
}
