import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { currentUser } from "@/lib/auth";

const contentTypes: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".pdf": "application/pdf" };
const allowedPrefixes = ["etb/", "etb-credential-tests/"];

export async function GET(request: NextRequest) {
  if (!await currentUser()) return new NextResponse("请先登录", { status: 401 });
  const key = request.nextUrl.searchParams.get("key") || "";
  if (!allowedPrefixes.some(prefix => key.startsWith(prefix))) return new NextResponse("证据文件不可用", { status: 400 });
  const root = resolve(process.env.FILE_STORAGE_ROOT || "./uploads");
  const file = resolve(root, key);
  if (relative(root, file).startsWith("..") || !contentTypes[extname(file).toLowerCase()]) return new NextResponse("证据文件不可用", { status: 400 });
  try {
    const bytes = await readFile(file);
    return new NextResponse(bytes, { headers: { "content-type": contentTypes[extname(file).toLowerCase()], "content-disposition": "inline" } });
  } catch {
    return new NextResponse("证据文件不存在", { status: 404 });
  }
}
