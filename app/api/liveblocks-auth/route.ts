import { currentUser } from "@clerk/nextjs/server";

import { apiError, readJsonBody } from "@/lib/api";
import { getCursorColor, liveblocks } from "@/lib/liveblocks";
import { findAccessibleProject, getCurrentIdentity } from "@/lib/project-access";

/**
 * Pull the Liveblocks room id out of the auth request body. The client sends
 * `{ room: string }` when authenticating for a room (see `authEndpoint`).
 */
function resolveRoomId(body: unknown): string | undefined {
  if (body && typeof body === "object" && "room" in body) {
    const value = (body as { room: unknown }).room;
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return undefined;
}

// POST /api/liveblocks-auth — issue a Liveblocks ID-token session for the
// signed-in Clerk user. The project id and the Liveblocks room id are the
// same value (architecture.md invariant 6).
export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return apiError("Unauthorized", 401);
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const roomId = resolveRoomId(body);
  if (!roomId) {
    return apiError("A room is required", 400);
  }

  const project = await findAccessibleProject(roomId, identity);
  if (!project) {
    return apiError("Forbidden", 403);
  }

  // Every token issued by this route has already passed the project access
  // check above, so the room itself only needs to allow identified users in —
  // there is no separate audience that could reach Liveblocks without going
  // through this endpoint first.
  await liveblocks.getOrCreateRoom(roomId, {
    defaultAccesses: ["room:write"],
  });

  const user = await currentUser();
  const { status, body: responseBody } = await liveblocks.identifyUser(
    identity.userId,
    {
      userInfo: {
        name: user?.fullName ?? identity.email ?? "Anonymous",
        avatar: user?.imageUrl ?? "",
        color: getCursorColor(identity.userId),
      },
    },
  );

  return new Response(responseBody, { status });
}
