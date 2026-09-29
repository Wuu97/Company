import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSessionCookie, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createHash } from "node:crypto";

export async function POST() {
  const session = parseSessionCookie((await cookies()).get(SESSION_COOKIE)?.value);
  if (session) await prisma.appSession.updateMany({ where: { tokenHash: createHash("sha256").update(session.token).digest("hex"), revokedAt: null }, data: { revokedAt: new Date() } });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", expires: new Date(0) });
  return response;
}
