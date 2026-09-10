import { auth } from "@clerk/nextjs/server";

import { Prisma } from "@/app/generated/prisma/client";
import { apiError, readJsonBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import {
  listOwnedProjects,
  resolveProjectId,
  resolveProjectName,
} from "@/lib/projects";

// GET /api/projects — list the authenticated user's own projects.
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return apiError("Unauthorized", 401);
  }

  const projects = await listOwnedProjects(userId);

  return Response.json({ projects });
}

// POST /api/projects — create a project owned by the authenticated user.
export async function POST(request: Request) {
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

  const id = resolveProjectId(body);

  try {
    const project = await prisma.project.create({
      data: {
        ...(id ? { id } : {}),
        ownerId: userId,
        name: resolveProjectName(body),
      },
    });

    return Response.json({ project }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return apiError("A project with that id already exists", 409);
    }

    throw error;
  }
}
