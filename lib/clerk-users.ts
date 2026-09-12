import { clerkClient } from "@clerk/nextjs/server";

/** The Clerk profile fields the share dialog needs to render a collaborator row. */
export interface ClerkUserSummary {
  name: string | null;
  avatarUrl: string | null;
}

/**
 * Look up Clerk users by email and return a case-insensitive email -> profile
 * map. Emails with no matching Clerk user are simply absent from the map, so
 * callers fall back to showing the email itself.
 */
export async function getClerkUsersByEmail(
  emails: string[],
): Promise<Map<string, ClerkUserSummary>> {
  const uniqueEmails = [...new Set(emails.map((email) => email.toLowerCase()))].slice(
    0,
    100,
  );
  const profiles = new Map<string, ClerkUserSummary>();

  if (uniqueEmails.length === 0) {
    return profiles;
  }

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({
    emailAddress: uniqueEmails,
    limit: uniqueEmails.length,
  });

  for (const user of users) {
    const summary: ClerkUserSummary = {
      name: user.fullName,
      avatarUrl: user.imageUrl,
    };
    for (const address of user.emailAddresses) {
      profiles.set(address.emailAddress.toLowerCase(), summary);
    }
  }

  return profiles;
}
