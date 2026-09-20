import { apiError, readJsonBody } from "@/lib/api";
import { loadCanvasSnapshot, saveCanvasSnapshot } from "@/lib/canvas-storage";
import { findAccessibleProject, getCurrentIdentity } from "@/lib/project-access";

// GET /api/projects/[projectId]/canvas — read the project's saved canvas
// state. Viewable by the owner or a collaborator (same access rule the
// room page and the collaborator list already use).
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/projects/[projectId]/canvas">,
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

  const snapshot = await loadCanvasSnapshot(project);
  return Response.json(snapshot ?? { nodes: [], edges: [] });
}

// PUT /api/projects/[projectId]/canvas — persist the latest canvas JSON.
// Any member of the collaborative room (owner or collaborator) can save,
// since the canvas itself is jointly edited in real time.
export async function PUT(
  request: Request,
  { params }: RouteContext<"/api/projects/[projectId]/canvas">,
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

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray((body as { nodes?: unknown }).nodes) ||
    !Array.isArray((body as { edges?: unknown }).edges)
  ) {
    return apiError("Expected a { nodes, edges } body", 400);
  }

  await saveCanvasSnapshot(projectId, {
    nodes: (body as { nodes: CanvasSnapshotBody["nodes"] }).nodes,
    edges: (body as { edges: CanvasSnapshotBody["edges"] }).edges,
  });

  return Response.json({ success: true });
}

type CanvasSnapshotBody = Parameters<typeof saveCanvasSnapshot>[1];
