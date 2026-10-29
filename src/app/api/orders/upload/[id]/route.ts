import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { LocalFileStorage } from "@/lib/storage";

/** Removes a staged upload that has not yet been submitted for recognition. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  const file = await prisma.soFileVersion.findFirst({ where: { id, soOrderId: null, parseStatus: "PENDING" } });
  if (!file) return NextResponse.json({ error: "该上传已进入识别流程，无法撤回。" }, { status: 409 });
  await prisma.$transaction(async tx => {
    await tx.soFileVersion.delete({ where: { id: file.id } });
    await tx.operationLog.create({ data: { action: "SO_FILE_DELETE_PENDING", entityType: "SoFileVersion", entityId: file.id, ...actorFields(actor), after: { storageKey: file.storageKey, staged: true } } });
  });
  await new LocalFileStorage().remove(file.storageKey);
  return NextResponse.json({ ok: true });
}
