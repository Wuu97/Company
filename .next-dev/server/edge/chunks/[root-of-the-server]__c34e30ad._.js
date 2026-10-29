(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__c34e30ad._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/lib/session-config.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SESSION_DURATION_MS",
    ()=>SESSION_DURATION_MS,
    "SESSION_RENEWAL_THRESHOLD_MS",
    ()=>SESSION_RENEWAL_THRESHOLD_MS,
    "assertSessionConfigured",
    ()=>assertSessionConfigured
]);
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_RENEWAL_THRESHOLD_MS = 6 * 24 * 60 * 60 * 1000;
function assertSessionConfigured(secret = process.env.SESSION_SECRET) {
    if (!secret || secret.length < 32 || secret.startsWith("replace-")) throw new Error("SESSION_SECRET 未配置为至少 32 位随机值");
    return secret;
}
}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2d$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session-config.ts [middleware-edge] (ecmascript)");
;
;
const encoder = new TextEncoder();
function base64url(bytes) {
    return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function validSession(value) {
    const secret = process.env.SESSION_SECRET;
    if (!value || !secret || secret.length < 32) return null;
    const [token, expiry, signature] = value.split(".");
    if (!token || !expiry || !signature || Number(expiry) <= Date.now()) return null;
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
        name: "HMAC",
        hash: "SHA-256"
    }, false, [
        "sign"
    ]);
    return base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(`${token}.${expiry}`))) === signature ? token : null;
}
async function refreshedCookie(token) {
    const expiresAt = new Date(Date.now() + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2d$config$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["SESSION_DURATION_MS"]);
    const payload = `${token}.${expiresAt.getTime()}`;
    const secret = process.env.SESSION_SECRET;
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
        name: "HMAC",
        hash: "SHA-256"
    }, false, [
        "sign"
    ]);
    return {
        value: `${payload}.${base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)))}`,
        expiresAt
    };
}
async function middleware(request) {
    const token = await validSession(request.cookies.get("tms_session")?.value);
    if (token) {
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        const session = await refreshedCookie(token);
        response.cookies.set("tms_session", session.value, {
            httpOnly: true,
            sameSite: "lax",
            secure: ("TURBOPACK compile-time value", "development") === "production",
            path: "/",
            expires: session.expiresAt
        });
        return response;
    }
    const login = new URL("/login", request.url);
    if (!request.nextUrl.pathname.startsWith("/api/")) login.searchParams.set("next", request.nextUrl.pathname);
    return request.nextUrl.pathname.startsWith("/api/") ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "请先登录"
    }, {
        status: 401
    }) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(login);
}
const config = {
    matcher: [
        "/((?!login|setup|api/auth|_next|favicon.ico).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__c34e30ad._.js.map