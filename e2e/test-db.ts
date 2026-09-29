export const testDatabaseUrl = process.env.E2E_DATABASE_URL;
if (!testDatabaseUrl) throw new Error("E2E_DATABASE_URL is required; never run E2E tests against the default database.");
const testUrl = new URL(testDatabaseUrl);
if (!/(?:e2e|test)/i.test(testUrl.pathname)) throw new Error("E2E_DATABASE_URL must name a dedicated test database.");

/** Test-only reset. The URL guard above prevents this from ever targeting a business database. */
export async function resetAuthState(db: { $executeRawUnsafe(query: string): Promise<unknown> }) {
  await db.$executeRawUnsafe('TRUNCATE TABLE "AppUser", "LoginAttempt" CASCADE');
}
