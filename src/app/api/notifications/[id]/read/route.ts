import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const result = await prisma.appNotification.updateMany({ where: { id: (await params).id, userId: user.id, readAt: null }, data: { readAt: new Date() } });
  if (!result.count) return NextResponse.json({ error: "通知不存在或已处理" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
