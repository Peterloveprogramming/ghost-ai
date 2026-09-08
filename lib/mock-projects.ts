import { slugify } from "@/lib/slug"

/**
 * Placeholder project data for the editor UI. There is no data layer yet —
 * every value here is static and lives only in client memory. Replace with
 * the Prisma-backed project model once it exists.
 */
export interface MockProject {
  id: string
  name: string
  slug: string
  /** `owner` projects expose rename/delete actions; `collaborator` projects do not. */
  access: "owner" | "collaborator"
}

function project(id: string, name: string, access: MockProject["access"]): MockProject {
  return { id, name, slug: slugify(name), access }
}

export const MOCK_PROJECTS: MockProject[] = [
  project("proj-payments", "Payments Platform", "owner"),
  project("proj-notifications", "Notification Fanout", "owner"),
  project("proj-search", "Search Indexing Pipeline", "owner"),
  project("proj-billing", "Billing Ledger", "collaborator"),
  project("proj-analytics", "Realtime Analytics", "collaborator"),
]
