import { auth } from "@clerk/nextjs/server";

import { apiError } from "@/lib/api";
import { removeCollaborator } from "@/lib/collaborators";
import { authorizeProjectMutation } from "@/lib/projects";

// DELETE /api/projects/[projectId]/collaborators/[collaboratorId] — remove a
// collaborator. Owner only.
export async function DELETE(
  _request: Request,
  {
    params,
  }: RouteContext<"/api/projects/[projectId]/collaborators/[collaboratorId]">,
) {
  const { userId } = await auth();
  if (!userId) {
    return apiError("Unauthorized", 401);
  }

  const { projectId, collaboratorId } = await params;
  const access = await authorizeProjectMutation(projectId, userId);
  if (!access.ok) {
    return apiError(
      access.status === 404 ? "Project not found" : "Forbidden",
      access.status,
    );
  }

  const removed = await removeCollaborator(projectId, collaboratorId);
  if (!removed) {
    return apiError("Collaborator not found", 404);
  }

  return Response.json({ success: true });
}
