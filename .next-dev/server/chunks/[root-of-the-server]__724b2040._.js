module.exports = [
"[project]/.next-internal/server/app/api/orders/parse/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[externals]/node:child_process [external] (node:child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:child_process", () => require("node:child_process"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

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
"[project]/src/app/api/orders/parse/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:child_process [external] (node:child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
const execFileAsync = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"]);
async function POST(request) {
    const actor = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["currentUser"])();
    if (!actor) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "请先登录"
    }, {
        status: 401
    });
    try {
        const body = await request.json().catch(()=>({}));
        const fileIds = Array.isArray(body.fileIds) ? body.fileIds.filter((id)=>typeof id === "string" && id.length > 0) : [];
        const file = body.orderId ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].soFileVersion.findFirst({
            where: {
                soOrderId: body.orderId,
                parseStatus: body.reparse ? "PARSED" : {
                    in: [
                        "PENDING",
                        "FAILED"
                    ]
                },
                ...body.reparse ? {
                    soOrder: {
                        parseStatus: {
                            in: [
                                "PARSED",
                                "VERIFIED"
                            ]
                        }
                    }
                } : {}
            },
            orderBy: {
                version: "desc"
            }
        }) : null;
        if (body.orderId && !file) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "该 SO 没有可识别的上传文件。"
        }, {
            status: 409
        });
        const { stdout, stderr } = await execFileAsync((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(process.cwd(), "node_modules/.bin/tsx"), [
            (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(process.cwd(), "scripts/parse-so-files.ts")
        ], {
            cwd: process.cwd(),
            timeout: 120_000,
            env: {
                ...process.env,
                ...fileIds.length ? {
                    SO_FILE_VERSION_IDS: fileIds.join(",")
                } : file ? {
                    SO_FILE_VERSION_ID: file.id,
                    ...file.parseStatus === "FAILED" ? {
                        RETRY_FAILED: "1"
                    } : {},
                    ...body.reparse ? {
                        REPARSE_PARSED: "1"
                    } : {}
                } : {}
            }
        });
        const summary = stdout.match(/PARSE_SUMMARY=(.+)$/m)?.[1];
        const result = summary ? JSON.parse(summary) : {
            processedCount: 0,
            failedCount: 0
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].operationLog.create({
            data: {
                action: "SO_PARSE_JOB_COMPLETED",
                entityType: "System",
                entityId: "so-parser",
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["actorFields"])(actor),
                after: result
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            ...result,
            output: stdout,
            errors: stderr
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : "解析任务失败"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__724b2040._.js.map