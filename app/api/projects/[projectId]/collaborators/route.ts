import { auth, currentUser } from "@clerk/nextjs/server";

import { Prisma } from "@/app/generated/prisma/client";
import { getClerkUsersByEmail, type ClerkUserSummary } from "@/lib/clerk-users";
import {
  addCollaborator,
  listCollaborators,
  parseCollaboratorEmail,
} from "@/lib/collaborators";
import { apiError, readJsonBody } from "@/lib/api";
import { findAccessibleProject, getCurrentIdentity } from "@/lib/project-access";
import { authorizeProjectMutation } from "@/lib/projects";

interface CollaboratorView {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

function toCollaboratorView(
  collaborator: { id: string; email: string },
  profiles: Map<string, ClerkUserSummary>,
): CollaboratorView {
  const profile = profiles.get(collaborator.email.toLowerCase());
  return {
    id: collaborator.id,
    email: collaborator.email,
    name: profile?.name ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
  };
}

// GET /api/projects/[projectId]/collaborators — list collaborators, enriched
// with Clerk profile data. Viewable by the owner or an existing collaborator.
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/projects/[projectId]/collaborators">,
) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return apiError("Unauthorized", 401);
  }

  const { projectId } = await params;
  const project = await findAccessibleProject(projectId, identity);
  if (!project) {
    return apiError("Project not found", 404);
  }

  const collaborators = await listCollaborators(projectId);
  const profiles = await getClerkUsersByEmail(
    collaborators.map((collaborator) => collaborator.email),
  );

  return Response.json({
    collaborators: collaborators.map((collaborator) =>
      toCollaboratorView(collaborator, profiles),
    ),
  });
}

// POST /api/projects/[projectId]/collaborators — invite a collaborator by
// email. Owner only.
export async function POST(
  request: Request,
  { params }: RouteContext<"/api/projects/[projectId]/collaborators">,
) {
  const { userId } = await auth();
  if (!userId) {
    return apiError("Unauthorized", 401);
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const email = parseCollaboratorEmail(
    body && typeof body === "object" && "email" in body
      ? (body as { email: unknown }).email
      : undefined,
  );
  if (!email) {
    return apiError("A valid email is required", 400);
  }

  const { projectId } = await params;
  const access = await authorizeProjectMutation(projectId, userId);
  if (!access.ok) {
    return apiError(
      access.status === 404 ? "Project not found" : "Forbidden",
      access.status,
    );
  }

  const owner = await currentUser();
  if (owner?.primaryEmailAddress?.emailAddress.toLowerCase() === email) {
    return apiError("You already have access to this project", 400);
  }

  try {
    const collaborator = await addCollaborator(projectId, email);
    const profiles = await getClerkUsersByEmail([email]);

    return Response.json(
      { collaborator: toCollaboratorView(collaborator, profiles) },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return apiError("This person is already a collaborator", 409);
    }

    throw error;
  }
}
