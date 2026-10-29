import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { PrismaClient } from "@prisma/client";
import { LocalFileStorage } from "../src/lib/storage";
import { actorFields } from "../src/lib/audit";

const db = new PrismaClient();

async function main() {
  const sourcePath = process.argv[2];
  if (!sourcePath) throw new Error("用法：tsx scripts/import-so-file.ts <SO PDF 路径>");
  const bytes = await readFile(sourcePath);
  const originalName = basename(sourcePath);
  const saved = await new LocalFileStorage().put({ bytes, originalName });
  const existing = await db.soFileVersion.findUnique({ where: { sha256: saved.sha256 }, select: { soOrderId: true, id: true } });
  if (existing) { console.log(`IMPORT_SUMMARY=${JSON.stringify({ duplicate: true, soOrderId: existing.soOrderId, soFileVersionId: existing.id })}`); return; }
  const actor = await db.appUser.findFirst({ where: { role: "ADMIN", active: true }, select: { id: true, name: true, role: true } });
  if (!actor) throw new Error("没有可归属审计记录的启用管理员账号");
  const result = await db.$transaction(async tx => {
    const order = await tx.soOrder.create({ data: { soNumber: "待解析", carrier: "待解析", parseStatus: "PENDING" } });
    const file = await tx.soFileVersion.create({ data: { soOrderId: order.id, storageKey: saved.key, originalName, sha256: saved.sha256, version: 1, parseStatus: "PENDING" } });
    await tx.operationLog.create({ data: { action: "SO_FILE_UPLOADED", entityType: "SoOrder", entityId: order.id, ...actorFields(actor), after: { file: saved.key, version: 1, parseStatus: "PENDING", importedBy: "local-import-script" } } });
    return { soOrderId: order.id, soFileVersionId: file.id };
  });
  console.log(`IMPORT_SUMMARY=${JSON.stringify({ duplicate: false, ...result })}`);
}

main().finally(() => db.$disconnect());
