import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { assertSessionConfigured, createSession, hashPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(200), password: z.string().min(8).max(200) });

type SetupFailure = "ALREADY_INITIALIZED" | "EMAIL_IN_USE" | "DATABASE_UNAVAILABLE" | "SESSION_CREATION_FAILED" | "SETUP_FAILED";

function failureResponse(error: SetupFailure, requestId: string, status: number, message: string) {
  return NextResponse.json({ error, message, requestId }, { status });
}

function classifySetupError(error: unknown): SetupFailure {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return "EMAIL_IN_USE";
  if (error instanceof Prisma.PrismaClientInitializationError || error instanceof Prisma.PrismaClientRustPanicError) return "DATABASE_UNAVAILABLE";
  if (error instanceof Error && error.message.includes("SESSION_SECRET")) return "SESSION_CREATION_FAILED";
  return "SETUP_FAILED";
}

function safeErrorStack(error: unknown) {
  // Prisma validation errors echo invalid input in their message. Keep only call frames.
  return error instanceof Error ? error.stack?.split("\n").filter(line => line.trimStart().startsWith("at ")).join("\n") : undefined;
}

export async function POST(request: Request) {
  const requestId = randomUUID();
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return failureResponse("SETUP_FAILED", requestId, 400, "请填写姓名、有效邮箱，以及至少 8 位密码");
  try {
    assertSessionConfigured();
    const passwordHash = await hashPassword(input.data.password);
    const result = await prisma.$transaction(async tx => {
      // Serialize the empty-system check. This protects concurrent first requests on PostgreSQL.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(2026092901)`;
      if (await tx.appUser.count()) throw new Error("SETUP_ALREADY_INITIALIZED");
      const user = await tx.appUser.create({ data: { name: input.data.name, email: input.data.email.toLowerCase(), passwordHash, role: "ADMIN" } });
      const session = await createSession(user.id, tx);
      return { user, session };
    });
    const response = NextResponse.json({ id: result.user.id, name: result.user.name, role: result.user.role }, { status: 201 });
    response.cookies.set(SESSION_COOKIE, result.session.value, sessionCookieOptions(result.session.expiresAt));
    return response;
  } catch (error) {
    const code = error instanceof Error && error.message === "SETUP_ALREADY_INITIALIZED" ? "ALREADY_INITIALIZED" : classifySetupError(error);
    const status = code === "ALREADY_INITIALIZED" || code === "EMAIL_IN_USE" ? 409 : code === "DATABASE_UNAVAILABLE" || code === "SESSION_CREATION_FAILED" ? 503 : 500;
    const message = code === "ALREADY_INITIALIZED" ? "系统已初始化，请使用登录页" : code === "EMAIL_IN_USE" ? "该邮箱已被使用" : code === "DATABASE_UNAVAILABLE" ? "服务暂时无法连接数据库，请稍后重试" : code === "SESSION_CREATION_FAILED" ? "系统会话服务异常，请联系管理员" : `创建首个账号失败，请联系管理员并提供请求编号 ${requestId}`;
    if (code !== "ALREADY_INITIALIZED" && code !== "EMAIL_IN_USE") console.error("setup_failed", { requestId, code, errorName: error instanceof Error ? error.name : "UnknownError", prismaCode: error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined, stack: safeErrorStack(error) });
    return failureResponse(code, requestId, status, message);
  }
}
