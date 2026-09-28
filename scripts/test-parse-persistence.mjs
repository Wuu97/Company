import { execFile } from "node:child_process";
import { symlink, unlink } from "node:fs/promises";
import { promisify } from "node:util";
import { PrismaClient } from "@prisma/client";

if (!process.env.E2E_DATABASE_URL) {
  throw new Error("E2E_DATABASE_URL is required for parser integration tests.");
}

const db = new PrismaClient({ datasources: { db: { url: process.env.E2E_DATABASE_URL } } });
const execFileAsync = promisify(execFile);
const token = `parse_integration_${Date.now()}_${Math.random().toString(36).slice(2)}`;
const fixtureKey = "362c60e0046e917348645b4d387e878a86fe4e9732c247efc2d2a5d8b801d645-SO_TSHGSZX26016499.pdf";
const storageKey = `${token}.pdf`;
let order;

function runParser(fileId, extraEnvironment = {}) {
  return execFileAsync("./node_modules/.bin/tsx", ["scripts/parse-so-files.ts"], {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: process.env.E2E_DATABASE_URL, SO_FILE_VERSION_ID: fileId, ...extraEnvironment },
  });
}

async function waitForLease(fileId) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const file = await db.soFileVersion.findUniqueOrThrow({ where: { id: fileId } });
    if (file.parseStatus === "PROCESSING" && file.processingToken) return file;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error("parser did not claim the task");
}

try {
  await symlink(fixtureKey, `uploads/${storageKey}`);
  order = await db.soOrder.create({ data: { soNumber: "OLD", carrier: "OLD", parseStatus: "VERIFIED" } });
  const file = await db.soFileVersion.create({
    data: { soOrderId: order.id, storageKey, originalName: "SO_TSHGSZX26016499.pdf", sha256: token, version: 1 },
  });

  const processA = runParser(file.id, { PARSE_DELAY_MS: "1200" });
  const leaseA = await waitForLease(file.id);
  await db.soFileVersion.update({
    where: { id: file.id },
    data: { processingStartedAt: new Date(Date.now() - 60_000) },
  });

  const processB = await runParser(file.id, { PARSE_LEASE_TIMEOUT_MS: "1" });
  const resultA = await processA;
  if (!resultA.stdout.includes("\"failedCount\":1")) throw new Error("expired parser should fail its save attempt");
  if (!processB.stdout.includes("\"processedCount\":1")) throw new Error("replacement parser did not complete");

  const finalFile = await db.soFileVersion.findUniqueOrThrow({ where: { id: file.id } });
  const changes = await db.soVersionChange.findMany({ where: { soOrderId: order.id } });
  const parseLogs = await db.operationLog.findMany({ where: { entityId: order.id, action: "SO_PARSED" } });
  if (finalFile.parseStatus !== "PARSED" || finalFile.processingToken !== null) throw new Error("expired parser changed replacement task state");
  if (changes.length !== 1 || parseLogs.length !== 1) throw new Error("expired parser created duplicate changes or logs");
  console.log("PARSE_PERSISTENCE_PASS");
} finally {
  await unlink(`uploads/${storageKey}`).catch(() => {});
  if (order) {
    await db.operationLog.deleteMany({ where: { entityId: order.id } });
    await db.soVersionChange.deleteMany({ where: { soOrderId: order.id } });
    await db.soFileVersion.deleteMany({ where: { soOrderId: order.id } });
    await db.soOrder.deleteMany({ where: { id: order.id } });
  }
  await db.$disconnect();
}
