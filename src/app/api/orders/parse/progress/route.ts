import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  if (!await currentUser()) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const ids = request.nextUrl.searchParams.get("fileIds")?.split(",").filter(Boolean) || [];
  if (!ids.length) return NextResponse.json({ total: 0, completed: 0, files: [] });
  const files = await prisma.soFileVersion.findMany({ where: { id: { in: ids } }, select: { id: true, parseStatus: true } });
  const completed = files.filter(file => file.parseStatus === "PARSED" || file.parseStatus === "FAILED").length;
  return NextResponse.json({ total: ids.length, completed, files });
}
