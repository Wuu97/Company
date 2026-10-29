export const testDatabaseUrl = process.env.E2E_DATABASE_URL;
if (!testDatabaseUrl) throw new Error("E2E_DATABASE_URL is required; never run E2E tests against the default database.");
const testUrl = new URL(testDatabaseUrl);
if (!/(?:e2e|test)/i.test(testUrl.pathname)) throw new Error("E2E_DATABASE_URL must name a dedicated test database.");
const TEST_MARKER = "company-e2e-reset-approved";
const TEST_EMAIL_PREFIX = "e2e-";

/** Refuses cleanup unless the database was explicitly marked as the isolated E2E fixture. */
export async function resetAuthState(db: PrismaClient) {
  const marker = await db.$queryRawUnsafe<Array<{ marker: string }>>('SELECT "marker" FROM "E2ETestMarker" WHERE "marker" = $1', TEST_MARKER);
  if (marker.length !== 1) throw new Error("E2E test marker is missing; refusing cleanup.");
  const nonTestUsers = await db.appUser.count({ where: { email: { not: { startsWith: TEST_EMAIL_PREFIX } } } });
  if (nonTestUsers !== 0) throw new Error("Refusing E2E cleanup because non-test users exist.");
  await db.appSession.deleteMany({ where: { user: { email: { startsWith: TEST_EMAIL_PREFIX } } } });
  await db.appUser.deleteMany({ where: { email: { startsWith: TEST_EMAIL_PREFIX } } });
  await db.loginAttempt.deleteMany({ where: { email: { startsWith: TEST_EMAIL_PREFIX } } });
}
import type { PrismaClient } from "@prisma/client";
