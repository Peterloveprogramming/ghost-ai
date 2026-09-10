/**
 * Shared helpers for `app/api` route handlers: a consistent error shape and a
 * lenient JSON body reader. Keeps the handlers themselves focused on auth,
 * ownership, and persistence.
 */

/**
 * Consistent JSON error body: `{ error: string }` plus an HTTP status. Every
 * failure response in `app/api` uses this shape.
 */
export function apiError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

/**
 * Parse a request body as JSON, tolerating an empty body. Returns `null` when
 * nothing was sent and throws `SyntaxError` when the payload is not valid JSON.
 */
export async function readJsonBody(request: Request): Promise<unknown> {
  const raw = await request.text();
  return raw.length > 0 ? JSON.parse(raw) : null;
}
