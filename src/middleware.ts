import { NextRequest, NextResponse } from "next/server";
import { SESSION_DURATION_MS } from "@/lib/session-config";

const encoder = new TextEncoder();
function base64url(bytes: ArrayBuffer) { return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
async function validSession(value: string | undefined) {
  const secret = process.env.SESSION_SECRET;
  if (!value || !secret || secret.length < 32) return null;
  const [token, expiry, signature] = value.split(".");
  if (!token || !expiry || !signature || Number(expiry) <= Date.now()) return null;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(`${token}.${expiry}`))) === signature ? token : null;
}

async function refreshedCookie(token: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const payload = `${token}.${expiresAt.getTime()}`;
  const secret = process.env.SESSION_SECRET!;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return { value: `${payload}.${base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)))}`, expiresAt };
}

export async function middleware(request: NextRequest) {
  const token = await validSession(request.cookies.get("tms_session")?.value);
  if (token) {
    const response = NextResponse.next();
    const session = await refreshedCookie(token);
    response.cookies.set("tms_session", session.value, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: session.expiresAt });
    return response;
  }
  const login = new URL("/login", request.url);
  if (!request.nextUrl.pathname.startsWith("/api/")) login.searchParams.set("next", request.nextUrl.pathname);
  return request.nextUrl.pathname.startsWith("/api/") ? NextResponse.json({ error: "请先登录" }, { status: 401 }) : NextResponse.redirect(login);
}

export const config = { matcher: ["/((?!login|setup|api/auth|_next|favicon.ico).*)"] };
