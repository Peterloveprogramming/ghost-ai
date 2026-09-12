import type { ProjectCollaborator } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pull a usable, lowercased email out of untrusted request input, or `null`
 * when it is missing, too long, or not a plausible email address.
 */
export function parseCollaboratorEmail(input: unknown): string | null {
  if (typeof input !== "string") {
    return null;
  }

  const trimmed = input.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > MAX_EMAIL_LENGTH) {
    return null;
  }

  return EMAIL_PATTERN.test(trimmed) ? trimmed : null;
}

/** Collaborators on a project, oldest invite first. */
export function listCollaborators(
  projectId: string,
): Promise<ProjectCollaborator[]> {
  return prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });
}

/** Add a collaborator by email. Throws Prisma `P2002` if already invited. */
export function addCollaborator(
  projectId: string,
  email: string,
): Promise<ProjectCollaborator> {
  return prisma.projectCollaborator.create({
    data: { projectId, email },
  });
}

/** Remove a collaborator, scoped to the project. Returns whether a row was deleted. */
export async function removeCollaborator(
  projectId: string,
  collaboratorId: string,
): Promise<boolean> {
  const { count } = await prisma.projectCollaborator.deleteMany({
    where: { id: collaboratorId, projectId },
  });

  return count > 0;
}
