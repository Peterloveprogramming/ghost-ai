import { auth } from "@clerk/nextjs/server";

import { apiError, readJsonBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { authorizeProjectMutation } from "@/lib/projects";

function ownershipError(status: 403 | 404) {
  return apiError(status === 404 ? "Project not found" : "Forbidden", status);
}

// PATCH /api/projects/[projectId] — rename a project. Owner only.
export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/projects/[projectId]">,
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

  const name =
    body && typeof body === "object" && "name" in body
      ? (body as { name: unknown }).name
      : undefined;

  if (typeof name !== "string" || name.trim().length === 0) {
    return apiError('A non-empty "name" is required', 400);
  }

  const { projectId } = await params;
  const access = await authorizeProjectMutation(projectId, userId);

  if (!access.ok) {
    return ownershipError(access.status);
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name: name.trim() },
  });

  return Response.json({ project });
}

// DELETE /api/projects/[projectId] — delete a project. Owner only.
export async function DELETE(
  _request: Request,
  { params }: RouteContext<"/api/projects/[projectId]">,
) {
  const { userId } = await auth();

  if (!userId) {
    return apiError("Unauthorized", 401);
  }

  const { projectId } = await params;
  const access = await authorizeProjectMutation(projectId, userId);

  if (!access.ok) {
    return ownershipError(access.status);
  }

  await prisma.project.delete({ where: { id: projectId } });

  return Response.json({ success: true });
}
