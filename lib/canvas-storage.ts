import { get, put } from "@vercel/blob";

import type { Project } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CanvasEdge, CanvasNode } from "@/types/canvas";

export interface CanvasSnapshot {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

/** Canvas JSON is private — only readable through this module's own
 * `get`/`put` calls (authenticated with `BLOB_READ_WRITE_TOKEN`), never via a
 * public URL. */
const CANVAS_BLOB_ACCESS = "private" as const;

/**
 * Upload the canvas JSON to Vercel Blob at a fixed, per-project pathname and
 * point the project's `canvasJsonPath` at that pathname. Prisma stores only
 * the reference; the JSON itself lives in Blob storage.
 */
export async function saveCanvasSnapshot(
  projectId: string,
  snapshot: CanvasSnapshot,
): Promise<string> {
  const pathname = `canvas/${projectId}.json`;

  await put(pathname, JSON.stringify(snapshot), {
    access: CANVAS_BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  await prisma.project.update({
    where: { id: projectId },
    data: { canvasJsonPath: pathname },
  });

  return pathname;
}

/**
 * Fetch a project's saved canvas JSON from Vercel Blob via its stored
 * pathname. Returns `null` when the project has never been saved.
 */
export async function loadCanvasSnapshot(
  project: Pick<Project, "canvasJsonPath">,
): Promise<CanvasSnapshot | null> {
  if (!project.canvasJsonPath) {
    return null;
  }

  const result = await get(project.canvasJsonPath, {
    access: CANVAS_BLOB_ACCESS,
  }).catch(() => null);

  if (!result || result.statusCode !== 200) {
    return null;
  }

  const data: unknown = await new Response(result.stream).json();
  if (
    !data ||
    typeof data !== "object" ||
    !Array.isArray((data as { nodes?: unknown }).nodes) ||
    !Array.isArray((data as { edges?: unknown }).edges)
  ) {
    return null;
  }

  return data as CanvasSnapshot;
}
