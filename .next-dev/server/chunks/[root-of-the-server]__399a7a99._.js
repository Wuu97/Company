module.exports = [
"[project]/.next-internal/server/app/api/orders/export/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/lib/session-config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/src/lib/passwords.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
;
;
const scrypt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["scrypt"]);
async function hashPassword(password) {
    const salt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(16).toString("base64url");
    const derived = await scrypt(password, salt, 64);
    return `scrypt$${salt}$${derived.toString("base64url")}`;
}
async function verifyPassword(password, encoded) {
    const [algorithm, salt, hash] = encoded.split("$");
    if (algorithm !== "scrypt" || !salt || !hash) return false;
    const expected = Buffer.from(hash, "base64url");
    const actual = await scrypt(password, salt, expected.length);
    return expected.length === actual.length && (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(expected, actual);
}
}),
"[project]/src/lib/auth.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthError",
    ()=>AuthError,
    "SESSION_COOKIE",
    ()=>SESSION_COOKIE,
    "authErrorResponse",
    ()=>authErrorResponse,
    "createSession",
    ()=>createSession,
    "currentUser",
    ()=>currentUser,
    "parseSessionCookie",
    ()=>parseSessionCookie,
    "requireAdmin",
    ()=>requireAdmin,
    "requireFinancialAccess",
    ()=>requireFinancialAccess,
    "sessionCookieOptions",
    ()=>sessionCookieOptions
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session-config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$passwords$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/passwords.ts [app-route] (ecmascript)");
;
;
;
;
;
const SESSION_COOKIE = "tms_session";
class AuthError extends Error {
    status;
    code;
    constructor(status, code){
        super(code), this.status = status, this.code = code;
    }
}
function authErrorResponse(error) {
    if (error instanceof AuthError) return Response.json({
        error: error.code === "UNAUTHENTICATED" ? "请先登录" : "无管理员权限",
        code: error.code
    }, {
        status: error.status
    });
    return Response.json({
        error: "身份验证失败",
        code: "AUTH_ERROR"
    }, {
        status: 500
    });
}
;
function sessionSecret() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertSessionConfigured"])();
}
function sha256(value) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(value).digest("hex");
}
function sign(value) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])("sha256", sessionSecret()).update(value).digest("base64url");
}
async function createSession(userId, db = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"]) {
    const token = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString("base64url");
    const expiresAt = new Date(Date.now() + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SESSION_DURATION_MS"]);
    await db.appSession.create({
        data: {
            userId,
            tokenHash: sha256(token),
            expiresAt
        }
    });
    const payload = `${token}.${expiresAt.getTime()}`;
    return {
        value: `${payload}.${sign(payload)}`,
        expiresAt
    };
}
function parseSessionCookie(value) {
    if (!value) return null;
    const [token, expiresText, signature] = value.split(".");
    if (!token || !expiresText || !signature) return null;
    const payload = `${token}.${expiresText}`;
    const expected = sign(payload);
    if (expected.length !== signature.length || !(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(Buffer.from(expected), Buffer.from(signature))) return null;
    const expiresAt = new Date(Number(expiresText));
    if (Number.isNaN(expiresAt.valueOf()) || expiresAt <= new Date()) return null;
    return {
        token,
        expiresAt
    };
}
function sessionCookieOptions(expiresAt) {
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: ("TURBOPACK compile-time value", "development") === "production",
        path: "/",
        expires: expiresAt
    };
}
async function currentUser() {
    const session = parseSessionCookie((await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])()).get(SESSION_COOKIE)?.value);
    if (!session) return null;
    const record = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].appSession.findUnique({
        where: {
            tokenHash: sha256(session.token)
        },
        include: {
            user: true
        }
    });
    if (!record || record.revokedAt || record.expiresAt <= new Date() || !record.user.active) return null;
    if (record.expiresAt.getTime() <= Date.now() + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SESSION_RENEWAL_THRESHOLD_MS"]) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].appSession.update({
            where: {
                id: record.id
            },
            data: {
                expiresAt: new Date(Date.now() + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SESSION_DURATION_MS"])
            }
        });
    }
    return record.user;
}
async function requireAdmin() {
    const user = await currentUser();
    if (!user) throw new AuthError(401, "UNAUTHENTICATED");
    if (user.role !== "ADMIN") throw new AuthError(403, "FORBIDDEN");
    return user;
}
async function requireFinancialAccess() {
    return requireAdmin();
}
}),
"[project]/src/app/api/orders/export/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript) <locals>");
;
;
;
const orderStatuses = [
    "PENDING_REVIEW",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED"
];
const parseStatuses = [
    "PENDING",
    "PROCESSING",
    "PARSED",
    "FAILED",
    "VERIFIED"
];
const escape = (value)=>`"${String(value ?? "").replace(/"/g, '""')}"`;
async function GET(request) {
    if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["currentUser"])()) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "请先登录"
    }, {
        status: 401
    });
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim() || "";
    const status = url.searchParams.get("status");
    const parseStatus = url.searchParams.get("parseStatus");
    const customerId = url.searchParams.get("customerId");
    const where = {
        ...orderStatuses.includes(status) ? {
            status: status
        } : {},
        ...parseStatuses.includes(parseStatus) ? {
            parseStatus: parseStatus
        } : {},
        ...customerId ? {
            customerId
        } : {},
        ...q ? {
            OR: [
                {
                    soNumber: {
                        contains: q,
                        mode: "insensitive"
                    }
                },
                {
                    carrier: {
                        contains: q,
                        mode: "insensitive"
                    }
                },
                {
                    vesselName: {
                        contains: q,
                        mode: "insensitive"
                    }
                },
                {
                    voyage: {
                        contains: q,
                        mode: "insensitive"
                    }
                }
            ]
        } : {}
    };
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].soOrder.findMany({
        where,
        include: {
            customer: true,
            containers: {
                where: {
                    active: true
                }
            },
            sailing: true
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 10_000
    });
    const lines = [
        [
            "SO 编号",
            "客户",
            "船公司",
            "船名",
            "航次",
            "装货港",
            "卸货港",
            "柜量",
            "预计开船时间（ETD）",
            "预计到港时间（ETA）",
            "补料截止时间（SI）",
            "预计靠港时间",
            "业务状态",
            "解析状态"
        ].map(escape).join(",")
    ];
    for (const order of orders){
        const containers = Object.entries(order.containers.reduce((total, item)=>({
                ...total,
                [item.containerType]: (total[item.containerType] || 0) + 1
            }), {})).map(([type, quantity])=>`${quantity} × ${type}`).join("；");
        lines.push([
            order.soNumber,
            order.customer?.name,
            order.carrier,
            order.vesselName,
            order.voyage,
            order.loadPort,
            order.dischargePort,
            containers,
            order.etdText,
            order.etaText,
            order.siCutoffText,
            order.etbText,
            order.status,
            order.parseStatus
        ].map(escape).join(","));
    }
    const filename = `so-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](`\uFEFF${lines.join("\r\n")}`, {
        headers: {
            "content-type": "text/csv; charset=utf-8",
            "content-disposition": `attachment; filename="${filename}"`
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__399a7a99._.js.map