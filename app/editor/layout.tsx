import { auth, currentUser } from "@clerk/nextjs/server"

import { EditorShell } from "@/components/editor/editor-shell"
import type { SidebarProject } from "@/hooks/use-project-actions"
import { listOwnedProjects, listSharedProjects } from "@/lib/projects"

/**
 * Server component: reads the signed-in user's owned and shared projects
 * up front and hands both lists to the editor chrome. No client-side fetch
 * on initial load — mutations re-enter through `router.refresh()`.
 */
export default async function EditorLayout({ children }: LayoutProps<"/editor">) {
  const { userId } = await auth()
  const user = userId ? await currentUser() : null
  const email = user?.primaryEmailAddress?.emailAddress ?? null

  const [owned, shared] = await Promise.all([
    userId ? listOwnedProjects(userId) : Promise.resolve([]),
    listSharedProjects(email),
  ])

  const toSidebarProject = (project: {
    id: string
    name: string
  }): SidebarProject => ({ id: project.id, name: project.name })

  return (
    <EditorShell
      ownedProjects={owned.map(toSidebarProject)}
      sharedProjects={shared.map(toSidebarProject)}
    >
      {children}
    </EditorShell>
  )
}
