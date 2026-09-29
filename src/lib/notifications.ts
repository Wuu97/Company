import { Prisma } from "@prisma/client";

export async function notifyActiveUsers(tx: Prisma.TransactionClient, input: { title: string; body: string; href?: string; kind: string; dedupeKey?: string; roles?: Array<"ADMIN" | "OPERATOR"> }) {
  const users = await tx.appUser.findMany({ where: { active: true, ...(input.roles ? { role: { in: input.roles } } : {}) }, select: { id: true } });
  if (!users.length) return 0;
  await tx.appNotification.createMany({ data: users.map(user => ({ userId: user.id, title: input.title, body: input.body, href: input.href, kind: input.kind, dedupeKey: input.dedupeKey })), skipDuplicates: true });
  return users.length;
}
