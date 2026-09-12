import { Compass } from "lucide-react"
import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { findAccessibleProject, getCurrentIdentity } from "@/lib/project-access"

/**
 * Collaborative workspace shell for a single room (room id == project id).
 * Server component: it verifies the signed-in user may open this project before
 * any workspace chrome renders. The real canvas, Liveblocks wiring, AI chat, and
 * sharing arrive in later steps.
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
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 [background:radial-gradient(ellipse_at_top,var(--accent),transparent_70%)]"
        />

        <div className="relative z-10 flex max-w-md flex-col items-center gap-5 px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-popover text-primary">
            <Compass className="size-6" />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Workspace shell
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Canvas and collaboration tooling land here next.
            </h1>
            <p className="text-sm text-muted-foreground">
              This room is ready for the shared architecture canvas, durable AI
              workflows, and real-time presence. For now, the shell is wired with
              project context and navigation only.
            </p>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute bottom-3 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-border"
        />
      </div>
    </section>
  )
}
