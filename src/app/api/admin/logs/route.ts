import { NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    await requireAdmin();
    const result = await prisma.operationLog.deleteMany();
    return NextResponse.json({ count: result.count });
  } catch (error) {
    return authErrorResponse(error);
  }
}
