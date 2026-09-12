import { auth, currentUser } from "@clerk/nextjs/server";

import type { Project } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/** The signed-in Clerk user's id and primary email address. */
export interface CurrentIdentity {
  userId: string;
  email: string | null;
}

/**
 * Resolve the signed-in Clerk user's id and primary email, or `null` when there
 * is no active session. Kept out of the page component so route handlers and
 * server components share one identity source.
 */
export async function getCurrentIdentity(): Promise<CurrentIdentity | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  return {
    userId,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
  };
}

/**
 * Load a project the given identity is allowed to open — either as its owner or
 * as a listed collaborator (matched on primary email). Returns `null` both for
 * unknown ids and for projects the user has no access to, so callers can treat
 * "missing" and "forbidden" the same way.
 */
export function findAccessibleProject(
  roomId: string,
  identity: CurrentIdentity,
): Promise<Project | null> {
  return prisma.project.findFirst({
    where: {
      id: roomId,
      OR: [
        { ownerId: identity.userId },
        ...(identity.email
          ? [{ collaborators: { some: { email: identity.email } } }]
          : []),
      ],
    },
  });
}
