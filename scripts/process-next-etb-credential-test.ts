import { prisma } from "../src/lib/prisma";
import { processCredentialTestRun } from "./process-etb-credential-test";

async function main() {
  const next = await prisma.etbCredentialTestRun.findFirst({ where: { status: "PENDING" }, orderBy: { createdAt: "asc" }, select: { id: true, terminal: true } });
  if (!next) { console.log(JSON.stringify({ status: "IDLE" })); return; }
  console.log(JSON.stringify({ status: "CLAIMING", id: next.id, terminal: next.terminal }));
  await processCredentialTestRun(next.id);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
