import { Prisma, PrismaClient } from "@prisma/client";

// A regenerated schema must also invalidate the client retained by hot reload.
const schemaVersion = JSON.stringify(Prisma.dmmf.datamodel);
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchemaVersion?: string;
};
const cached = globalForPrisma.prisma;
export const prisma = cached && globalForPrisma.prismaSchemaVersion === schemaVersion
  ? cached
  : new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  if (cached && cached !== prisma) void cached.$disconnect();
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchemaVersion = schemaVersion;
}
