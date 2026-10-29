import { PrismaClient } from "@prisma/client";

const marker = "company-e2e-reset-approved";
const databaseUrl = process.env.E2E_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("E2E_DATABASE_URL is required; refusing to initialize any default database.");
}

const parsedUrl = new URL(databaseUrl);
const databaseName = parsedUrl.pathname.replace(/^\//, "");
if (databaseName !== "logistics_settlement_test") {
  throw new Error("E2E_DATABASE_URL must point exactly to logistics_settlement_test.");
}

const db = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

async function main() {
  const [{ current_database: currentDatabase }] = await db.$queryRawUnsafe<Array<{ current_database: string }>>(
    "SELECT current_database()",
  );
  if (currentDatabase !== databaseName) {
    throw new Error(`Database identity check failed: expected ${databaseName}, received ${currentDatabase}.`);
  }

  // This table is intentionally E2E-fixture-only. It is not an application model
  // and is recreated only after migrations in the dedicated test database.
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "E2ETestMarker" (
      "id" TEXT PRIMARY KEY,
      "marker" TEXT NOT NULL UNIQUE,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.$executeRawUnsafe(
    'INSERT INTO "E2ETestMarker" ("id", "marker") VALUES ($1, $2) ON CONFLICT ("marker") DO NOTHING',
    "e2e-isolated-database-marker",
    marker,
  );
}

main()
  .then(() => console.log("Initialized E2E marker in logistics_settlement_test."))
  .finally(() => db.$disconnect());
