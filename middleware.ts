import { NextRequest, NextResponse } from "next/server";

const encoder = new TextEncoder();
function base64url(bytes: ArrayBuffer) { return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
async function validSession(value: string | undefined) {
  const secret = process.env.SESSION_SECRET;
  if (!value || !secret || secret.length < 32) return false;
  const [token, expiry, signature] = value.split(".");
  if (!token || !expiry || !signature || Number(expiry) <= Date.now()) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(`${token}.${expiry}`))) === signature;
}
export async function middleware(request: NextRequest) {
  if (await validSession(request.cookies.get("tms_session")?.value)) return NextResponse.next();
  const login = new URL("/login", request.url);
  if (!request.nextUrl.pathname.startsWith("/api/")) login.searchParams.set("next", request.nextUrl.pathname);
  return request.nextUrl.pathname.startsWith("/api/") ? NextResponse.json({ error: "请先登录" }, { status: 401 }) : NextResponse.redirect(login);
}
export const config = { matcher: ["/((?!login|setup|_next|favicon.ico).*)"] };
