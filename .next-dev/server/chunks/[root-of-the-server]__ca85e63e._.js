module.exports = [
"[project]/.next-internal/server/app/api/orders/etb-query/bulk/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

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
"[project]/src/lib/etb-query-status.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activeEtbRunStatuses",
    ()=>activeEtbRunStatuses
]);
const activeEtbRunStatuses = [
    "PENDING",
    "RUNNING",
    "AWAITING_MANUAL"
];
}),
"[project]/src/lib/time.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** All operational cut-off values are interpreted in China Standard Time (UTC+08:00). */ __turbopack_context__.s([
    "OPERATION_TIME_ZONE",
    ()=>OPERATION_TIME_ZONE,
    "chinaDateParts",
    ()=>chinaDateParts,
    "chinaDateTimeLocalValue",
    ()=>chinaDateTimeLocalValue,
    "chinaLocalDateTimeToDate",
    ()=>chinaLocalDateTimeToDate,
    "estimateEtbFromPortCutoff",
    ()=>estimateEtbFromPortCutoff,
    "formatChinaDateTime",
    ()=>formatChinaDateTime,
    "formatOperationalTimeText",
    ()=>formatOperationalTimeText
]);
const OPERATION_TIME_ZONE = "Asia/Shanghai";
const CST_OFFSET_MS = 8 * 60 * 60 * 1000;
function chinaDateParts(date) {
    const cst = new Date(date.getTime() + CST_OFFSET_MS);
    return {
        year: cst.getUTCFullYear(),
        month: cst.getUTCMonth() + 1,
        day: cst.getUTCDate(),
        hour: cst.getUTCHours(),
        minute: cst.getUTCMinutes()
    };
}
function formatChinaDateTime(date) {
    const { year, month, day, hour, minute } = chinaDateParts(date);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
function chinaDateTimeLocalValue(date) {
    return formatChinaDateTime(date).replace(" ", "T");
}
function chinaLocalDateTimeToDate(value) {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})$/);
    if (!match) return undefined;
    const [, year, month, day, hour, minute] = match;
    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00+08:00`);
    return Number.isNaN(date.valueOf()) ? undefined : date;
}
function formatOperationalTimeText(value) {
    const text = value.trim();
    const months = {
        JAN: "01",
        FEB: "02",
        MAR: "03",
        APR: "04",
        MAY: "05",
        JUN: "06",
        JUL: "07",
        AUG: "08",
        SEP: "09",
        SEPT: "09",
        OCT: "10",
        NOV: "11",
        DEC: "12"
    };
    const named = text.match(/(\d{1,2})[-/]([A-Z]{3,4})[-/](\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/i);
    if (named) {
        const month = months[named[2].toUpperCase()];
        if (month) return `${named[3].length === 2 ? `20${named[3]}` : named[3]}-${month}-${named[1].padStart(2, "0")}${named[4] ? ` ${named[4].padStart(2, "0")}:${named[5]}` : ""}`;
    }
    const namedSpace = text.match(/(\d{1,2})\s+([A-Z]{3,9})\s+(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/i);
    if (namedSpace) {
        const month = months[namedSpace[2].slice(0, 4).toUpperCase()];
        if (month) return `${namedSpace[3]}-${month}-${namedSpace[1].padStart(2, "0")}${namedSpace[4] ? ` ${namedSpace[4].padStart(2, "0")}:${namedSpace[5]}` : ""}`;
    }
    const compactNamed = text.match(/(\d{1,2})\s*([A-Z]{3,4})\s*(\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/i);
    if (compactNamed) {
        const month = months[compactNamed[2].toUpperCase()];
        if (month) return `${compactNamed[3].length === 2 ? `20${compactNamed[3]}` : compactNamed[3]}-${month}-${compactNamed[1].padStart(2, "0")}${compactNamed[4] ? ` ${compactNamed[4].padStart(2, "0")}:${compactNamed[5]}` : ""}`;
    }
    const yearFirst = text.match(/(\d{4})[/.\-](\d{1,2})[/.\-](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (yearFirst) return `${yearFirst[1]}-${yearFirst[2].padStart(2, "0")}-${yearFirst[3].padStart(2, "0")}${yearFirst[4] ? ` ${yearFirst[4].padStart(2, "0")}:${yearFirst[5]}` : ""}`;
    const dayFirst = text.match(/(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (dayFirst) return `${dayFirst[3]}-${dayFirst[2].padStart(2, "0")}-${dayFirst[1].padStart(2, "0")}${dayFirst[4] ? ` ${dayFirst[4].padStart(2, "0")}:${dayFirst[5]}` : ""}`;
    return text;
}
function estimateEtbFromPortCutoff(value) {
    if (!value) return undefined;
    const normalized = formatOperationalTimeText(value);
    const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?$/);
    if (!match) return undefined;
    const [, year, month, day, hour = "", minute = ""] = match;
    const cutoff = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    if (Number.isNaN(cutoff.valueOf())) return undefined;
    cutoff.setUTCDate(cutoff.getUTCDate() - 7);
    const date = `${cutoff.getUTCFullYear()}-${String(cutoff.getUTCMonth() + 1).padStart(2, "0")}-${String(cutoff.getUTCDate()).padStart(2, "0")}`;
    return hour ? `${date} ${hour}:${minute}` : date;
}
}),
"[project]/src/lib/notifications.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "notifyActiveUsers",
    ()=>notifyActiveUsers
]);
async function notifyActiveUsers(tx, input) {
    const users = await tx.appUser.findMany({
        where: {
            active: true,
            ...input.roles ? {
                role: {
                    in: input.roles
                }
            } : {}
        },
        select: {
            id: true
        }
    });
    if (!users.length) return 0;
    await tx.appNotification.createMany({
        data: users.map((user)=>({
                userId: user.id,
                title: input.title,
                body: input.body,
                href: input.href,
                kind: input.kind,
                dedupeKey: input.dedupeKey
            })),
        skipDuplicates: true
    });
    return users.length;
}
}),
"[project]/src/lib/audit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "actorFields",
    ()=>actorFields,
    "auditActionLabel",
    ()=>auditActionLabel,
    "auditEntityLabel",
    ()=>auditEntityLabel
]);
function actorFields(actor) {
    return actor ? {
        actorUserId: actor.id,
        actorName: actor.name,
        actorRole: actor.role
    } : {};
}
const actionLabels = {
    SO_FILE_UPLOADED: "上传 SO 文件",
    SO_FILE_VERSION_UPLOADED: "上传 SO 新版本",
    SO_REVIEWED: "人工核对 SO",
    SO_FIELD_UPDATED: "更新 SO 字段",
    SO_STATUS_CHANGED: "变更 SO 状态",
    SO_VERSION_CHANGE_APPLIED: "应用 SO 版本差异",
    SO_DELETED: "删除 SO",
    SO_FILE_DELETE_PENDING: "SO 文件待人工删除",
    SO_CONTAINERS_ADJUSTED: "调整 SO 柜量",
    CONTAINER_CREATED: "创建内部柜子",
    CONTAINER_NUMBER_UPDATED: "更新实际柜号",
    CONTAINER_LOADING_COMPLETED: "登记装柜完成与实际柜号",
    CARGO_ITEM_CREATED: "新增货物明细",
    CARGO_ITEM_UPDATED: "更新货物明细",
    CARGO_ITEM_DELETED: "删除货物明细",
    CUSTOMER_CREATED: "创建客户",
    CUSTOMER_UPDATED: "更新客户",
    FACTORY_CREATED: "创建工厂",
    FACTORY_UPDATED: "更新工厂",
    CUSTOMER_CONFIRMATION_CREATED: "记录客户上柜确认",
    CUSTOMER_CONFIRMATION_CANCELLED: "取消客户确认",
    CUSTOMER_CONTACT_TASK_RESOLVED: "处理客户联系待办",
    ORDER_MILESTONE_UPDATED: "更新单证/执行节点",
    LOADING_PLAN_CREATED: "创建装柜计划",
    LOADING_PLAN_ADJUSTED: "调整装柜计划",
    LOADING_PLAN_CANCELLED: "取消装柜计划",
    TRANSPORT_TASK_CREATED: "创建运输任务",
    TRANSPORT_TASK_STATUS_CHANGED: "更新运输状态",
    TRANSPORT_LEG_CREATED: "新增运输段",
    TRANSPORT_COST_CREATED: "新增运输费用",
    TRANSPORT_COST_UPDATED: "更新运输费用",
    TRANSPORT_COST_DELETED: "删除运输费用",
    TRANSPORT_ETB_IMPACT_RESOLVED: "处理运输 ETB 影响",
    ETB_IMPACTED_DISPATCHED_TRANSPORT: "发现已派车 ETB 影响",
    SAILING_CREATED: "创建船期",
    SAILING_MANUALLY_SUPPLEMENTED: "人工补录船期",
    SO_SAILING_LINKED_MANUALLY: "手工关联船期",
    SO_SAILING_UNLINKED: "解除船期关联",
    ETB_OBSERVED: "录入 ETB 观测",
    ETB_CHANGE_DETECTED: "发现 ETB 变化",
    ETB_ADOPTED: "采用 ETB 业务时间",
    ETB_QUERY_MANUAL_HANDOFF: "ETB 查询转人工处理",
    ETB_SOURCE_CREDENTIAL_UPDATED: "更新 ETB 数据源账号",
    ETB_CREDENTIAL_TEST_QUEUED: "发起 ETB 账号验证",
    USER_CREATED: "创建家庭成员账号",
    USER_ENABLED: "启用家庭成员账号",
    USER_DISABLED: "停用家庭成员账号",
    USER_PASSWORD_RESET: "重置成员密码",
    USER_CHANGED_OWN_PASSWORD: "修改本人密码",
    SO_PARSE_JOB_COMPLETED: "执行 SO 解析任务"
};
const entityLabels = {
    SoOrder: "SO 订单",
    SoFileVersion: "SO 文件",
    ContainerUnit: "内部柜子",
    CargoItem: "货物明细",
    OrderMilestone: "单证/执行节点",
    Customer: "客户",
    Factory: "工厂",
    CustomerConfirmation: "客户确认",
    CustomerContactTask: "客户联系待办",
    LoadingPlan: "装柜计划",
    TransportTask: "运输任务",
    TransportCost: "运输费用",
    Sailing: "船期",
    EtbQueryRun: "ETB 查询任务",
    DataSourceCredential: "ETB 数据源账号",
    EtbCredentialTestRun: "ETB 账号验证",
    AppUser: "家庭成员"
};
function auditActionLabel(action) {
    return actionLabels[action] || action;
}
function auditEntityLabel(entityType) {
    return entityLabels[entityType] || entityType;
}
}),
"[project]/src/lib/services/etb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adoptEtbObservation",
    ()=>adoptEtbObservation,
    "recordEtbObservation",
    ()=>recordEtbObservation,
    "recordEtbObservationInTransaction",
    ()=>recordEtbObservationInTransaction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/time.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/notifications.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-route] (ecmascript)");
;
;
;
;
async function recordEtbObservationInTransaction(tx, input) {
    await tx.$queryRaw`SELECT id FROM "Sailing" WHERE id=${input.sailingId} FOR UPDATE`;
    const sailing = await tx.sailing.findUnique({
        where: {
            id: input.sailingId
        },
        select: {
            id: true,
            adoptedEtbAt: true,
            pendingEtbAt: true,
            pendingEtbSource: true
        }
    });
    if (!sailing) throw new Error("船期不存在");
    // Repeated polling commonly returns the same unadopted value.  Keep its
    // evidence, but do not repeatedly create pending work and notifications.
    const isSame = sailing.adoptedEtbAt?.valueOf() === input.etbAt.valueOf() || sailing.pendingEtbAt?.valueOf() === input.etbAt.valueOf() && sailing.pendingEtbSource === input.source;
    const { note, actor, ...observationInput } = input;
    const observation = await tx.sailingObservation.create({
        data: {
            ...observationInput,
            status: isSame ? "IGNORED" : "PENDING",
            reviewNote: note
        }
    });
    if (!isSame) {
        await tx.soOrder.updateMany({
            where: {
                sailingId: sailing.id
            },
            data: {
                etbText: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatChinaDateTime"])(input.etbAt),
                etbSource: input.source,
                etbObservedAt: new Date(),
                etbNeedsReview: true
            }
        });
        await tx.sailing.update({
            where: {
                id: sailing.id
            },
            data: {
                pendingEtbAt: input.etbAt,
                pendingEtbSource: input.source,
                pendingEtbObservedAt: new Date(),
                etbNeedsReview: true
            }
        });
        const orders = await tx.soOrder.findMany({
            where: {
                sailingId: sailing.id
            },
            select: {
                id: true
            }
        });
        await tx.soOrder.updateMany({
            where: {
                sailingId: sailing.id
            },
            data: {
                etbNeedsReview: true
            }
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["notifyActiveUsers"])(tx, {
            kind: "ETB_CHANGE",
            title: "船期 ETB 变化待核实",
            body: `${input.etbAt.toISOString()} 的 ETB 观测已到达，关联 ${orders.length} 个 SO；在人工采用前不会修改业务计划。`,
            href: `/sailings/${sailing.id}`
        });
        await tx.operationLog.createMany({
            data: orders.map((order)=>({
                    action: "ETB_CHANGE_DETECTED",
                    entityType: "SoOrder",
                    entityId: order.id,
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["actorFields"])(input.actor),
                    after: {
                        sailingId: sailing.id,
                        etbAt: input.etbAt.toISOString(),
                        source: input.source
                    }
                }))
        });
        const tasks = await tx.transportTask.findMany({
            where: {
                loadingPlan: {
                    soOrder: {
                        sailingId: sailing.id
                    }
                },
                status: {
                    in: [
                        "DISPATCHED",
                        "IN_TRANSIT"
                    ]
                }
            },
            select: {
                id: true
            }
        });
        if (tasks.length) {
            await tx.transportTask.updateMany({
                where: {
                    id: {
                        in: tasks.map((task)=>task.id)
                    }
                },
                data: {
                    etbImpactNeedsReview: true,
                    etbImpactResolvedAt: null,
                    etbImpactResolutionNote: null
                }
            });
            await tx.operationLog.createMany({
                data: tasks.map((task)=>({
                        action: "ETB_IMPACTED_DISPATCHED_TRANSPORT",
                        entityType: "TransportTask",
                        entityId: task.id,
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["actorFields"])(input.actor),
                        after: {
                            sailingId: sailing.id,
                            etbAt: input.etbAt.toISOString(),
                            source: input.source
                        }
                    }))
            });
        }
    }
    await tx.operationLog.create({
        data: {
            action: "ETB_OBSERVED",
            entityType: "Sailing",
            entityId: sailing.id,
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["actorFields"])(input.actor),
            after: {
                etbAt: input.etbAt.toISOString(),
                source: input.source,
                status: observation.status
            }
        }
    });
    return observation;
}
async function recordEtbObservation(input) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction((tx)=>recordEtbObservationInTransaction(tx, input));
}
async function adoptEtbObservation(sailingId, observationId, note, actor) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
        await tx.$queryRaw`SELECT id FROM "Sailing" WHERE id=${sailingId} FOR UPDATE`;
        const observation = await tx.sailingObservation.findFirst({
            where: {
                id: observationId,
                sailingId,
                status: "PENDING"
            }
        });
        if (!observation) throw new Error("待核实的 ETB 观测不存在");
        await tx.sailingObservation.updateMany({
            where: {
                sailingId,
                status: "PENDING",
                id: {
                    not: observationId
                }
            },
            data: {
                status: "SUPERSEDED",
                reviewedAt: new Date(),
                reviewNote: "被新的人工采用值取代"
            }
        });
        await tx.sailingObservation.update({
            where: {
                id: observationId
            },
            data: {
                status: "ADOPTED",
                reviewedAt: new Date(),
                reviewNote: note
            }
        });
        const adoptedAt = new Date();
        await tx.sailing.update({
            where: {
                id: sailingId
            },
            data: {
                adoptedEtbAt: observation.etbAt,
                adoptedEtbSource: observation.source,
                adoptedEtbAtConfirmedAt: adoptedAt,
                pendingEtbAt: null,
                pendingEtbSource: null,
                pendingEtbObservedAt: null,
                etbNeedsReview: false
            }
        });
        const orders = await tx.soOrder.findMany({
            where: {
                sailingId
            },
            select: {
                id: true
            }
        });
        await tx.soOrder.updateMany({
            where: {
                sailingId
            },
            data: {
                etbText: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatChinaDateTime"])(observation.etbAt),
                etbSource: observation.source,
                etbObservedAt: observation.observedAt,
                etbNeedsReview: false
            }
        });
        await tx.operationLog.createMany({
            data: orders.map((order)=>({
                    action: "ETB_ADOPTED",
                    entityType: "SoOrder",
                    entityId: order.id,
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["actorFields"])(actor),
                    after: {
                        sailingId,
                        observationId,
                        etbAt: observation.etbAt.toISOString(),
                        source: observation.source,
                        note
                    }
                }))
        });
        return observation;
    });
}
}),
"[project]/src/lib/etb-query-state.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EtbManualHandoffRequiredError",
    ()=>EtbManualHandoffRequiredError,
    "etbQueryFailureState",
    ()=>etbQueryFailureState
]);
class EtbManualHandoffRequiredError extends Error {
    sessionState;
    options;
    constructor(message, sessionState, options){
        super(message), this.sessionState = sessionState, this.options = options;
        this.name = "EtbManualHandoffRequiredError";
    }
}
function etbQueryFailureState(error) {
    if (error instanceof EtbManualHandoffRequiredError) {
        return {
            status: "AWAITING_MANUAL",
            sessionState: error.sessionState,
            errorMessage: error.message,
            handoffReason: error.message,
            screenshotStorageKey: error.options?.screenshotStorageKey,
            retryAfter: error.options?.retryAfter
        };
    }
    return {
        status: "FAILED",
        sessionState: "NOT_REQUIRED",
        errorMessage: error instanceof Error ? error.message : "未知查询失败"
    };
}
}),
"[project]/src/lib/etb-query-completion.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "etbCompletionState",
    ()=>etbCompletionState
]);
function etbCompletionState(resultCount, unmatchedCount) {
    if (unmatchedCount > 0 || resultCount === 0) {
        return {
            status: "AWAITING_MANUAL",
            sessionState: "MANUAL_HANDOFF_REQUIRED",
            handoffReason: resultCount === 0 ? "数据源未返回可匹配的在用船期，需人工确认查询条件或建立匹配关系。" : `有 ${unmatchedCount} 条 ETB 结果未匹配到船期，需人工确认。`
        };
    }
    return {
        status: "SUCCEEDED",
        sessionState: "ACTIVE",
        handoffReason: null
    };
}
}),
"[project]/src/lib/carrier-name.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Stable carrier identity used for SO-to-terminal matching and sailing keys. */ __turbopack_context__.s([
    "normalizeCarrierName",
    ()=>normalizeCarrierName,
    "sameCarrierName",
    ()=>sameCarrierName
]);
const aliases = {
    "CMA CGM": "CMA CGM",
    "CMACGM": "CMA CGM",
    "MAERSK": "MAERSK",
    "MAERSK LINE": "MAERSK",
    "AP MOLLER MAERSK": "MAERSK",
    "COSCO": "COSCO",
    "COSCO SHIPPING": "COSCO",
    "HAPAG LLOYD": "HAPAG-LLOYD",
    "HAPAGLLOYD": "HAPAG-LLOYD",
    "MSC": "MSC",
    "MEDITERRANEAN SHIPPING COMPANY": "MSC",
    "OOCL": "OOCL",
    "ORIENT OVERSEAS CONTAINER LINE": "OOCL",
    "ONE": "ONE",
    "OCEAN NETWORK EXPRESS": "ONE",
    "EVERGREEN": "EVERGREEN",
    "EVERGREEN MARINE": "EVERGREEN",
    "KMTC": "KMTC",
    "KOREA MARINE TRANSPORT": "KMTC",
    "ZIM": "ZIM",
    "ZIM INTEGRATED SHIPPING": "ZIM",
    "YANG MING": "YANG MING",
    "WAN HAI": "WAN HAI",
    "PIL": "PIL",
    "TS LINES": "TS LINES",
    "TSLINES": "TS LINES"
};
function aliasKey(value) {
    return value.normalize("NFKC").trim().toUpperCase().replace(/[._\-/]+/g, " ").replace(/\s+/g, " ");
}
function normalizeCarrierName(value) {
    const normalized = aliasKey(value);
    return aliases[normalized] || normalized;
}
function sameCarrierName(left, right) {
    return Boolean(left && right && normalizeCarrierName(left) === normalizeCarrierName(right));
}
}),
"[project]/src/lib/etb-match.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sameEtbIdentity",
    ()=>sameEtbIdentity,
    "uniqueEtbMatch",
    ()=>uniqueEtbMatch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$carrier$2d$name$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/carrier-name.ts [app-route] (ecmascript)");
;
function normalized(value) {
    return value.normalize("NFKC").trim().toUpperCase().replace(/[\s\-_/]+/g, "");
}
function sameEtbIdentity(left, right) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$carrier$2d$name$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeCarrierName"])(left.carrier) === (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$carrier$2d$name$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeCarrierName"])(right.carrier) && normalized(left.vesselName) === normalized(right.vesselName) && normalized(left.voyage) === normalized(right.voyage);
}
function uniqueEtbMatch(result, candidates) {
    const matches = candidates.filter((candidate)=>sameEtbIdentity(result, candidate));
    return matches.length === 1 ? matches[0] : undefined;
}
}),
"[project]/src/lib/etb-source-config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEtbSourceConfig",
    ()=>getEtbSourceConfig
]);
const sources = {
    盐田: {
        terminal: "盐田",
        source: "YANTIAN_CONTROLLED_BROWSER",
        homeUrl: "https://www.156yt.cn/",
        queryLandingUrl: "https://www.156yt.cn/publicInfoService/index.action",
        queryUrl: "https://www.156yt.cn/pqs_revision/pages/jsp/voyQuery.jsp",
        authentication: "LOGIN_REQUIRED",
        automationStatus: "PENDING_TECHNICAL_VERIFICATION",
        credentialEnvPrefix: "ETB_YANTIAN",
        loginSelectorStatus: "PENDING_TECHNICAL_VERIFICATION",
        throttle: {
            batchMaxSailings: 20,
            queryIntervalMs: 1_200,
            maxAttempts: 2,
            retryBaseDelayMs: 3_000
        }
    },
    蛇口: {
        terminal: "蛇口",
        source: "SHEKOU_CONTROLLED_BROWSER",
        // ePort owns authentication. wk-eport becomes available only after its SSO
        // session is established; direct anonymous navigation can return 404.
        homeUrl: "https://eport.cmp1872.com/login#",
        allowedEvidenceHosts: [
            "eport.cmp1872.com",
            "wk-eport.cmp1872.com"
        ],
        queryLandingUrl: "https://wk-eport.cmp1872.com/#/main/home",
        authentication: "LOGIN_REQUIRED",
        automationStatus: "PENDING_TECHNICAL_VERIFICATION",
        credentialEnvPrefix: "ETB_SHEKOU",
        loginSelectorStatus: "PENDING_TECHNICAL_VERIFICATION",
        throttle: {
            batchMaxSailings: 10,
            queryIntervalMs: 2_000,
            maxAttempts: 2,
            retryBaseDelayMs: 4_000
        }
    }
};
function getEtbSourceConfig(terminal) {
    const config = sources[terminal];
    if (!config) throw new Error("仅支持盐田或蛇口 ETB 受控浏览器 Worker");
    return config;
}
}),
"[project]/src/lib/etb-evidence.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "invalidEtbEvidence",
    ()=>invalidEtbEvidence,
    "missingEtbEvidence",
    ()=>missingEtbEvidence,
    "requiresEtbResultEvidence",
    ()=>requiresEtbResultEvidence
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$source$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/etb-source-config.ts [app-route] (ecmascript)");
;
function requiresEtbResultEvidence(source) {
    return source.endsWith("_CONTROLLED_BROWSER");
}
function missingEtbEvidence(results) {
    return results.find((result)=>!result.sourceUrl || !result.screenshotStorageKey);
}
function invalidEtbEvidence(terminal, results) {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$source$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEtbSourceConfig"])(terminal);
    const sourceHosts = new Set([
        new URL(config.homeUrl).hostname,
        ...config.allowedEvidenceHosts || []
    ]);
    return results.find((result)=>{
        if (!result.sourceUrl || !result.screenshotStorageKey) return true;
        try {
            return !sourceHosts.has(new URL(result.sourceUrl).hostname) || !/^etb\/.+\.(png|jpe?g|webp)$/i.test(result.screenshotStorageKey);
        } catch  {
            return true;
        }
    });
}
}),
"[project]/src/lib/etb-query.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "completeEtbQueryRun",
    ()=>completeEtbQueryRun,
    "enqueueEtbQueryRun",
    ()=>enqueueEtbQueryRun,
    "runEtbQuery",
    ()=>runEtbQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$etb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/etb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2d$state$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/etb-query-state.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2d$completion$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/etb-query-completion.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$match$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/etb-match.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$evidence$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/etb-evidence.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2d$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/etb-query-status.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
async function enqueueEtbQueryRun(input) {
    // Scheduled jobs are batch-wide. Do not stack a second browser run while the
    // previous batch is pending, running, or awaiting a staff CAPTCHA action.
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
        // A transaction-scoped advisory lock makes the check/create sequence safe
        // even though PostgreSQL cannot express this partial uniqueness rule in
        // Prisma's schema.
        const queueKey = input.targetSailingId ? `etb-target:${input.targetSailingId}` : `etb-batch:${input.terminal}`;
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${queueKey}))`;
        const existing = await tx.etbQueryRun.findFirst({
            where: input.targetSailingId ? {
                targetSailingId: input.targetSailingId,
                status: {
                    in: [
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2d$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activeEtbRunStatuses"]
                    ]
                }
            } : {
                terminal: input.terminal,
                targetSailingId: null,
                status: {
                    in: [
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2d$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activeEtbRunStatuses"]
                    ]
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        if (existing) return existing;
        return tx.etbQueryRun.create({
            data: {
                terminal: input.terminal,
                source: input.source,
                scheduledFor: input.scheduledFor,
                targetSailingId: input.targetSailingId,
                status: "PENDING"
            }
        });
    });
}
async function completeEtbQueryRun(input) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
        await tx.$queryRaw`SELECT id FROM "EtbQueryRun" WHERE id=${input.runId} FOR UPDATE`;
        const run = await tx.etbQueryRun.findUnique({
            where: {
                id: input.runId
            },
            select: {
                id: true,
                terminal: true,
                status: true,
                targetSailingId: true
            }
        });
        if (!run) throw new Error("ETB 查询任务不存在");
        // A worker may submit exactly once per claim.  A resumed manual task is
        // claimed as RUNNING again, so accepting AWAITING_MANUAL here only creates
        // a duplicate-completion window.
        if (run.status !== "RUNNING") throw new Error("该 ETB 查询任务不能再接收结果");
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$evidence$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requiresEtbResultEvidence"])(input.source) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$evidence$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["invalidEtbEvidence"])(run.terminal, input.results)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2d$state$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EtbManualHandoffRequiredError"]("受控浏览器查询结果缺少合格的页面链接或 ETB 结果区域截图，不能作为 ETB 业务证据入库。", "MANUAL_HANDOFF_REQUIRED");
        }
        let matched = 0;
        const unmatched = [];
        const candidates = await tx.sailing.findMany({
            where: run.targetSailingId ? {
                id: run.targetSailingId,
                terminal: run.terminal
            } : {
                terminal: run.terminal
            },
            select: {
                id: true,
                carrier: true,
                vesselName: true,
                voyage: true
            }
        });
        let screenshotStorageKey;
        for (const result of input.results){
            screenshotStorageKey ||= result.screenshotStorageKey;
            const sailing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$match$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uniqueEtbMatch"])(result, candidates);
            if (!sailing) {
                unmatched.push(result);
                continue;
            }
            if (result.portCutoffText) await tx.soOrder.updateMany({
                where: {
                    sailingId: sailing.id
                },
                data: {
                    portCutoffText: result.portCutoffText
                }
            });
            if (result.etbAt) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$etb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordEtbObservationInTransaction"])(tx, {
                sailingId: sailing.id,
                etbAt: result.etbAt,
                source: input.source,
                sourceUrl: result.sourceUrl,
                screenshotStorageKey: result.screenshotStorageKey
            });
            else if (result.portCutoffText) await tx.soOrder.updateMany({
                where: {
                    sailingId: sailing.id
                },
                data: {
                    etbText: null,
                    etbSource: null,
                    etbObservedAt: new Date()
                }
            });
            matched += 1;
        }
        if (unmatched.length) {
            await tx.etbUnmatchedResult.createMany({
                data: unmatched.filter((result)=>result.etbAt).map((result)=>({
                        queryRunId: run.id,
                        carrier: result.carrier,
                        vesselName: result.vesselName,
                        voyage: result.voyage,
                        etbAt: result.etbAt,
                        sourceUrl: result.sourceUrl,
                        screenshotStorageKey: result.screenshotStorageKey,
                        matchNote: "自动匹配未命中"
                    }))
            });
        }
        const completion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2d$completion$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["etbCompletionState"])(matched, unmatched.length);
        const completed = await tx.etbQueryRun.update({
            where: {
                id: run.id
            },
            data: {
                source: input.source,
                status: completion.status,
                sessionState: completion.sessionState,
                handoffReason: completion.handoffReason,
                resultCount: matched,
                screenshotStorageKey,
                errorMessage: null,
                finishedAt: new Date()
            }
        });
        await tx.operationLog.create({
            data: {
                action: "ETB_QUERY_WORKER_COMPLETED",
                entityType: "EtbQueryRun",
                entityId: run.id,
                after: {
                    source: input.source,
                    resultCount: input.results.length,
                    matched,
                    unmatched: unmatched.length,
                    status: completion.status
                }
            }
        });
        return completed;
    });
}
async function runEtbQuery(input) {
    const run = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].etbQueryRun.create({
        data: {
            terminal: input.terminal,
            source: input.source,
            scheduledFor: input.scheduledFor,
            status: "RUNNING",
            startedAt: new Date()
        }
    });
    try {
        if (!input.adapter) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2d$state$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EtbManualHandoffRequiredError"]("尚未完成真实数据源验证或配置。请由员工在受控浏览器完成登录/验证后重试，或人工录入观测结果。", "MANUAL_HANDOFF_REQUIRED");
        }
        const results = await input.adapter.query({
            terminal: input.terminal,
            scheduledFor: input.scheduledFor
        });
        return await completeEtbQueryRun({
            runId: run.id,
            source: input.adapter.source,
            results
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].etbQueryRun.update({
            where: {
                id: run.id
            },
            data: {
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2d$state$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["etbQueryFailureState"])(error),
                finishedAt: new Date()
            }
        });
    }
}
}),
"[project]/src/app/api/orders/etb-query/bulk/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2d$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/etb-query-status.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/etb-query.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$source$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/etb-source-config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
const schema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    orderIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().cuid()).min(1).max(50)
});
async function POST(request) {
    const actor = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["currentUser"])();
    if (!actor) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "请先登录"
    }, {
        status: 401
    });
    const input = schema.safeParse(await request.json());
    if (!input.success) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "请选择 1 至 50 个 SO"
    }, {
        status: 400
    });
    const orderIds = [
        ...new Set(input.data.orderIds)
    ];
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].soOrder.findMany({
        where: {
            id: {
                in: orderIds
            }
        },
        include: {
            sailing: {
                select: {
                    id: true,
                    terminal: true
                }
            }
        }
    });
    const byId = new Map(orders.map((order)=>[
            order.id,
            order
        ]));
    const skipped = [];
    const sailingOrders = new Map();
    for (const orderId of orderIds){
        const order = byId.get(orderId);
        if (!order) {
            skipped.push({
                orderId,
                reason: "SO 不存在"
            });
            continue;
        }
        if (!order.sailing) {
            skipped.push({
                orderId,
                reason: "尚未关联船期"
            });
            continue;
        }
        const group = sailingOrders.get(order.sailing.id) ?? {
            terminal: order.sailing.terminal,
            orderIds: []
        };
        group.orderIds.push(orderId);
        sailingOrders.set(order.sailing.id, group);
    }
    let queuedRunCount = 0;
    let queuedOrderCount = 0;
    const runIds = [];
    for (const [sailingId, group] of sailingOrders){
        let source;
        try {
            source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$source$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEtbSourceConfig"])(group.terminal).source;
        } catch  {
            skipped.push(...group.orderIds.map((orderId)=>({
                    orderId,
                    reason: `暂不支持 ${group.terminal} 的 ETB 查询`
                })));
            continue;
        }
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].etbQueryRun.findFirst({
            where: {
                targetSailingId: sailingId,
                status: {
                    in: [
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2d$status$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activeEtbRunStatuses"]
                    ]
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        if (existing) {
            skipped.push(...group.orderIds.map((orderId)=>({
                    orderId,
                    reason: "该船期已有进行中的查询任务"
                })));
            continue;
        }
        const run = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$etb$2d$query$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["enqueueEtbQueryRun"])({
            terminal: group.terminal,
            source,
            scheduledFor: new Date(),
            targetSailingId: sailingId
        });
        queuedRunCount += 1;
        queuedOrderCount += group.orderIds.length;
        runIds.push(run.id);
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].operationLog.create({
        data: {
            action: "ETB_QUERY_BULK_MANUAL_REQUESTED",
            entityType: "SoOrder",
            entityId: orderIds.join(","),
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["actorFields"])(actor),
            after: {
                orderIds,
                runIds,
                queuedRunCount,
                queuedOrderCount,
                skipped
            }
        }
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        queuedRunCount,
        queuedOrderCount,
        runIds,
        skipped
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ca85e63e._.js.map