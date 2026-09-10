import type { Project } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const DEFAULT_PROJECT_NAME = "Untitled Project";

/** Upper bound for a caller-supplied project id. */
const MAX_PROJECT_ID_LENGTH = 128;

/**
 * Pull a usable project name out of untrusted request input, falling back to
 * {@link DEFAULT_PROJECT_NAME} when the caller omits it or sends a blank value.
 */
export function resolveProjectName(input: unknown): string {
  if (input && typeof input === "object" && "name" in input) {
    const value = (input as { name: unknown }).name;
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return DEFAULT_PROJECT_NAME;
}

/**
 * Pull a caller-supplied project id out of untrusted request input. The client
 * derives this from the project name so the project id and the Liveblocks room
 * id stay aligned; when absent or unusable the schema's uuid default is used.
 */
export function resolveProjectId(input: unknown): string | undefined {
  if (input && typeof input === "object" && "id" in input) {
    const value = (input as { id: unknown }).id;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0 && trimmed.length <= MAX_PROJECT_ID_LENGTH) {
        return trimmed;
      }
    }
  }

  return undefined;
}

/** Projects owned by the given Clerk user, newest first. */
export function listOwnedProjects(userId: string): Promise<Project[]> {
  return prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Projects shared with the given email through the ProjectCollaborator join,
 * newest first. Returns an empty list when the caller has no known email.
 */
export function listSharedProjects(
  email: string | null | undefined,
): Promise<Project[]> {
  if (!email) {
    return Promise.resolve([]);
  }

  return prisma.project.findMany({
    where: { collaborators: { some: { email } } },
    orderBy: { createdAt: "desc" },
  });
}

export type ProjectMutationAccess =
  | { ok: true; project: Project }
  | { ok: false; status: 403 | 404 };

/**
 * Load a project and confirm the given Clerk user owns it. Rename and delete
 * are owner-only: non-owners get `403`, unknown ids get `404`.
 */
export async function authorizeProjectMutation(
  projectId: string,
  userId: string,
): Promise<ProjectMutationAccess> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    return { ok: false, status: 404 };
  }

  if (project.ownerId !== userId) {
    return { ok: false, status: 403 };
  }

  return { ok: true, project };
}
