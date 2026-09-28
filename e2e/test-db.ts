export const testDatabaseUrl = process.env.E2E_DATABASE_URL;
if (!testDatabaseUrl) throw new Error("E2E_DATABASE_URL is required; never run E2E tests against the default database.");
