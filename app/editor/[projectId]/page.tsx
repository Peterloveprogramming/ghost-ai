/**
 * Project workspace route. The create flow navigates here after a project is
 * made, and delete redirects away from here when the active project is removed.
 * The collaborative canvas is a later feature — this is a placeholder shell so
 * the navigation wired in 08-wire-editor-home.md resolves end to end.
 */
export default async function ProjectWorkspacePage({
  params,
}: PageProps<"/editor/[projectId]">) {
  const { projectId } = await params

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-lg font-medium text-foreground">Workspace</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Room{" "}
        <span className="font-mono text-foreground">{projectId}</span> is ready.
        The collaborative canvas lands in a later step.
      </p>
    </div>
  )
}
