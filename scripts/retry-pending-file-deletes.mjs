import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient(); try { for (const log of await db.operationLog.findMany({ where: { action: "SO_FILE_DELETE_PENDING" } })) { const storageKey = log.after?.storageKey; if (typeof storageKey !== "string") continue; try { await unlink(join(process.env.FILE_STORAGE_ROOT || "./uploads", storageKey)); } catch (error) { if (error.code !== "ENOENT") continue; } await db.operationLog.delete({ where: { id: log.id } }); console.log(`FILE_DELETE_RETRIED ${storageKey}`); } } finally { await db.$disconnect(); }
