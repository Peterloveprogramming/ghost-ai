import Link from "next/link"
import { Lock } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

/**
 * Shown in the workspace canvas area when the current user may not open a room —
 * either the project does not exist or they are not the owner or a collaborator.
 */
export function AccessDenied() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
        <Lock className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium text-foreground">
          You don&rsquo;t have access to this project
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          It may have been removed, or you&rsquo;re not a collaborator on it.
        </p>
      </div>
      <Link href="/editor" className={buttonVariants({ variant: "outline" })}>
        Back to projects
      </Link>
    </div>
  )
}
