module.exports = [
"[project]/.next-internal/server/app/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/time.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/risk-alerts.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateRiskAlerts",
    ()=>evaluateRiskAlerts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/time.ts [app-rsc] (ecmascript)");
;
function parseSourceTime(value) {
    const numeric = value.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})\s+(\d{1,2}):(\d{2})/);
    if (numeric) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["chinaLocalDateTimeToDate"])(`${numeric[3]}-${numeric[2].padStart(2, "0")}-${numeric[1].padStart(2, "0")}T${numeric[4].padStart(2, "0")}:${numeric[5]}`);
    const named = value.match(/(\d{1,2})[-/]([A-Z]{3,4})[-/](\d{2,4})\s+(\d{1,2}):(\d{2})/i);
    if (!named) return;
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
    const month = months[named[2].toUpperCase()];
    if (!month) return;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["chinaLocalDateTimeToDate"])(`${named[3].length === 2 ? `20${named[3]}` : named[3]}-${month}-${named[1].padStart(2, "0")}T${named[4].padStart(2, "0")}:${named[5]}`);
}
function nearestSi(order) {
    const candidates = [
        {
            label: "货代补料截止",
            value: order.forwarderSiCutoffText
        },
        {
            label: "船公司补料截止",
            value: order.siCutoffText
        }
    ].flatMap((item)=>{
        const deadline = item.value ? parseSourceTime(item.value) : undefined;
        return deadline ? [
            {
                label: item.label,
                value: item.value,
                deadline
            }
        ] : [];
    });
    return candidates.sort((left, right)=>left.deadline.valueOf() - right.deadline.valueOf())[0];
}
function evaluateRiskAlerts(orders, now = new Date()) {
    const alerts = [];
    for (const order of orders){
        const href = `/orders/${order.id}`;
        if (order.etbNeedsReview) alerts.push({
            type: "ETB_REVIEW",
            severity: "WARNING",
            title: `${order.soNumber} 的 ETB 待核实`,
            detail: "船期出现新观测，业务采用时间尚未被自动覆盖。",
            href,
            orderId: order.id
        });
        const deadlines = [
            nearestSi(order),
            ...[
                [
                    "开仓",
                    order.openingText
                ],
                [
                    "VGM 截止",
                    order.vgmCutoffText
                ],
                [
                    "截关",
                    order.portCutoffText
                ]
            ].map(([label, value])=>({
                    label,
                    value,
                    deadline: value ? parseSourceTime(value) : undefined
                }))
        ];
        for (const item of deadlines){
            if (!item?.deadline) continue;
            const hours = (item.deadline.valueOf() - now.valueOf()) / 3_600_000;
            if (hours < 0 || hours > 48) continue;
            alerts.push({
                type: "DEADLINE",
                severity: hours <= 12 ? "CRITICAL" : "WARNING",
                title: `${order.soNumber}：${item.label}临近`,
                detail: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatChinaDateTime"])(item.deadline)}（剩余约 ${Math.max(0, Math.ceil(hours))} 小时）`,
                href,
                orderId: order.id
            });
        }
        for (const plan of order.plans.filter((plan)=>[
                "DRAFT",
                "CONFIRMED"
            ].includes(plan.status))){
            const hours = (plan.scheduledAt.valueOf() - now.valueOf()) / 3_600_000;
            if (hours >= 0 && hours <= 24) alerts.push({
                type: "PLAN_RISK",
                severity: "WARNING",
                title: `${order.soNumber}：装柜计划临近`,
                detail: `计划时间 ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatChinaDateTime"])(plan.scheduledAt)}，请优先以更近的补料截关时间安排。`,
                href,
                orderId: order.id
            });
        }
    }
    return alerts.sort((a, b)=>a.severity === b.severity ? 0 : a.severity === "CRITICAL" ? -1 : 1);
}
}),
"[project]/src/lib/so-review-task.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "soReviewReasons",
    ()=>soReviewReasons
]);
const labels = {
    soNumber: "SO 编号",
    carrier: "船公司",
    vesselName: "船名",
    voyage: "航次",
    loadPort: "装货港",
    dischargePort: "卸货港",
    emptyPickupLocation: "提空柜地点",
    fullReturnLocation: "交重柜地点",
    containers: "柜型/柜量"
};
function soReviewReasons(review) {
    if (!review?.needsReview) return [];
    const fieldNames = (fields)=>(fields ?? []).map((field)=>labels[field] ?? field).join("、");
    return [
        review.missingCoreFields?.length ? `缺少：${fieldNames(review.missingCoreFields)}` : "",
        review.conflictingFields?.length ? `冲突：${fieldNames(review.conflictingFields)}` : ""
    ].filter(Boolean);
}
}),
"[project]/src/lib/status-labels.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "statusLabel",
    ()=>statusLabel,
    "statusTone",
    ()=>statusTone
]);
const labels = {
    PENDING_REVIEW: "待处理",
    CONFIRMED: "已确认",
    IN_PROGRESS: "进行中",
    COMPLETED: "已完成",
    CANCELLED: "已取消",
    PENDING: "待处理",
    PROCESSING: "处理中",
    PARSED: "已解析",
    FAILED: "失败",
    VERIFIED: "已核对",
    DRAFT: "草稿",
    REPLACED: "已替代",
    PLANNED: "待派车",
    DISPATCHED: "已派车",
    IN_TRANSIT: "运输中",
    PARTIAL: "部分确认",
    OPEN: "待联系",
    RESOLVED: "已处理",
    NOT_REQUIRED: "不适用",
    QUEUED: "排队中",
    RUNNING: "执行中",
    SUCCEEDED: "成功",
    AWAITING_MANUAL: "待人工处理",
    MANUAL: "人工处理",
    NONE: "无会话",
    ADOPTED: "已采用",
    REJECTED: "已拒绝",
    IGNORED: "已忽略",
    SUPERSEDED: "已替代",
    DEFERRED: "已延期"
};
function statusLabel(value) {
    return value ? labels[value] || value : "—";
}
const tones = {
    CONFIRMED: "success",
    COMPLETED: "success",
    VERIFIED: "success",
    RESOLVED: "success",
    SUCCEEDED: "success",
    ADOPTED: "success",
    PENDING_REVIEW: "warning",
    IN_PROGRESS: "warning",
    PENDING: "warning",
    PROCESSING: "warning",
    PARSED: "warning",
    PARTIAL: "warning",
    OPEN: "warning",
    PLANNED: "warning",
    DISPATCHED: "warning",
    IN_TRANSIT: "warning",
    QUEUED: "warning",
    RUNNING: "warning",
    FAILED: "critical",
    CANCELLED: "critical",
    REJECTED: "critical",
    AWAITING_MANUAL: "critical",
    DRAFT: "muted",
    REPLACED: "muted",
    SUPERSEDED: "muted",
    IGNORED: "muted",
    NOT_REQUIRED: "muted",
    MANUAL: "muted",
    NONE: "muted",
    DEFERRED: "warning",
    ACTIVE: "success",
    EXPIRED: "warning",
    ROBOT_VERIFICATION_REQUIRED: "critical",
    MANUAL_HANDOFF_REQUIRED: "critical"
};
function statusTone(value) {
    return value ? tones[value] || "default" : "default";
}
}),
"[project]/src/components/ui/page-header.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "page-header-module__fdV59G__actions",
  "copy": "page-header-module__fdV59G__copy",
  "description": "page-header-module__fdV59G__description",
  "header": "page-header-module__fdV59G__header",
  "title": "page-header-module__fdV59G__title",
});
}),
"[project]/src/components/ui/page-header.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageHeader",
    ()=>PageHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/page-header.module.css [app-rsc] (css module)");
;
;
function PageHeader({ title, description, actions, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].header,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].copy,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].title,
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page-header.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].description,
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page-header.tsx",
                        lineNumber: 17,
                        columnNumber: 24
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/page-header.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            actions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2d$header$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].actions,
                children: actions
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page-header.tsx",
                lineNumber: 19,
                columnNumber: 18
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/page-header.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/status-badge.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "badge": "status-badge-module__BLtyLW__badge",
  "critical": "status-badge-module__BLtyLW__critical",
  "muted": "status-badge-module__BLtyLW__muted",
  "small": "status-badge-module__BLtyLW__small",
  "success": "status-badge-module__BLtyLW__success",
  "unread": "status-badge-module__BLtyLW__unread",
  "warning": "status-badge-module__BLtyLW__warning",
});
}),
"[project]/src/components/ui/status-badge.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatusBadge",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/status-badge.module.css [app-rsc] (css module)");
;
;
function StatusBadge({ children, tone, className, size = "default" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].badge,
            tone && tone !== "default" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"][tone] : undefined,
            size === "small" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].small : undefined,
            className
        ].filter(Boolean).join(" "),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/status-badge.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/action-button.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "button": "action-button-module__IlhC4q__button",
  "danger": "action-button-module__IlhC4q__danger",
  "neutral": "action-button-module__IlhC4q__neutral",
  "secondary": "action-button-module__IlhC4q__secondary",
  "small": "action-button-module__IlhC4q__small",
  "statusAction": "action-button-module__IlhC4q__statusAction",
  "text": "action-button-module__IlhC4q__text",
  "toolbar": "action-button-module__IlhC4q__toolbar",
  "wide": "action-button-module__IlhC4q__wide",
  "wideMobile": "action-button-module__IlhC4q__wideMobile",
});
}),
"[project]/src/components/ui/button.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "ButtonLink",
    ()=>ButtonLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/action-button.module.css [app-rsc] (css module)");
;
;
const variantClass = {
    primary: undefined,
    secondary: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].secondary,
    danger: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].danger,
    neutral: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].neutral,
    text: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].text
};
function classNames(variant, size, wide, className) {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].button,
        variantClass[variant],
        size === "toolbar" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].toolbar : undefined,
        size === "small" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].small : undefined,
        wide === true ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].wide : undefined,
        wide === "mobile" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].wideMobile : undefined,
        className
    ].filter(Boolean).join(" ");
}
function Button({ variant = "primary", size = "default", wide = false, className, type = "button", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        className: classNames(variant, size, wide, className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 25,
        columnNumber: 10
    }, this);
}
function ButtonLink({ variant = "primary", size = "default", wide = false, className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        className: classNames(variant, size, wide, className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/app/page.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "alertAction": "page-module___8aEwW__alertAction",
  "alertItem": "page-module___8aEwW__alertItem",
  "alertList": "page-module___8aEwW__alertList",
  "card": "page-module___8aEwW__card",
  "cardAction": "page-module___8aEwW__cardAction",
  "cardTitle": "page-module___8aEwW__cardTitle",
  "cards": "page-module___8aEwW__cards",
  "critical": "page-module___8aEwW__critical",
  "intro": "page-module___8aEwW__intro",
  "number": "page-module___8aEwW__number",
  "quiet": "page-module___8aEwW__quiet",
  "taskGrid": "page-module___8aEwW__taskGrid",
  "taskHint": "page-module___8aEwW__taskHint",
});
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/business.module.css [app-rsc] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$risk$2d$alerts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/risk-alerts.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/time.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$so$2d$review$2d$task$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/so-review-task.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2d$labels$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/status-labels.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/page-header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/status-badge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/page.module.css [app-rsc] (css module)");
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
;
const alertSeverityLabels = {
    CRITICAL: "紧急",
    WARNING: "需关注"
};
async function Dashboard() {
    const [pendingOrders, parseReviewCandidates, unmatchedOrders, unplanned, etbOrders, etbHandoffs, contactTasks, impactedTransport, ordersForConfirm, riskOrders] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].soOrder.findMany({
            where: {
                parseStatus: {
                    in: [
                        "PENDING",
                        "PARSED",
                        "FAILED"
                    ]
                }
            },
            select: {
                id: true,
                soNumber: true,
                carrier: true,
                parseStatus: true
            },
            take: 8,
            orderBy: {
                createdAt: "desc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].soOrder.findMany({
            where: {
                parseStatus: "PARSED"
            },
            select: {
                id: true,
                soNumber: true,
                carrier: true,
                files: {
                    orderBy: {
                        version: "desc"
                    },
                    take: 1,
                    select: {
                        rawExtraction: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].soOrder.findMany({
            where: {
                customerId: null
            },
            select: {
                id: true,
                soNumber: true,
                carrier: true
            },
            take: 8,
            orderBy: {
                createdAt: "desc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].containerUnit.findMany({
            where: {
                active: true,
                planItems: {
                    none: {
                        active: true
                    }
                }
            },
            select: {
                id: true,
                internalCode: true,
                containerType: true,
                soOrder: {
                    select: {
                        id: true,
                        soNumber: true
                    }
                }
            },
            take: 8,
            orderBy: {
                internalCode: "asc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].soOrder.findMany({
            where: {
                etbNeedsReview: true
            },
            select: {
                id: true,
                soNumber: true,
                etbText: true,
                sailing: {
                    select: {
                        id: true
                    }
                }
            },
            take: 8,
            orderBy: {
                createdAt: "desc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].etbQueryRun.findMany({
            where: {
                status: "AWAITING_MANUAL",
                manualHandledAt: null
            },
            select: {
                id: true,
                terminal: true,
                handoffReason: true,
                errorMessage: true
            },
            take: 8,
            orderBy: {
                createdAt: "desc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].customerContactTask.findMany({
            where: {
                status: "OPEN"
            },
            select: {
                id: true,
                dueAt: true,
                soOrder: {
                    select: {
                        id: true,
                        soNumber: true
                    }
                }
            },
            take: 8,
            orderBy: {
                dueAt: "asc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].transportTask.findMany({
            where: {
                etbImpactNeedsReview: true
            },
            select: {
                id: true,
                scheduledAt: true,
                loadingPlan: {
                    select: {
                        soOrder: {
                            select: {
                                id: true,
                                soNumber: true
                            }
                        }
                    }
                }
            },
            take: 8,
            orderBy: {
                scheduledAt: "asc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].soOrder.findMany({
            where: {
                containers: {
                    some: {
                        active: true
                    }
                }
            },
            include: {
                containers: {
                    where: {
                        active: true
                    },
                    select: {
                        id: true
                    }
                },
                confirmations: {
                    where: {
                        status: {
                            in: [
                                "PARTIAL",
                                "CONFIRMED"
                            ]
                        }
                    },
                    select: {
                        quantity: true
                    }
                }
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].soOrder.findMany({
            select: {
                id: true,
                soNumber: true,
                etbNeedsReview: true,
                openingText: true,
                siCutoffText: true,
                forwarderSiCutoffText: true,
                vgmCutoffText: true,
                portCutoffText: true,
                plans: {
                    select: {
                        scheduledAt: true,
                        status: true
                    }
                }
            }
        })
    ]);
    const parseReviewOrders = parseReviewCandidates.map((order)=>({
            ...order,
            reasons: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$so$2d$review$2d$task$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["soReviewReasons"])(order.files[0]?.rawExtraction?.parseReview)
        })).filter((order)=>order.reasons.length);
    const pendingConfirm = ordersForConfirm.filter((order)=>order.confirmations.reduce((sum, item)=>sum + item.quantity, 0) < order.containers.length).length;
    const alerts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$risk$2d$alerts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateRiskAlerts"])(riskOrders);
    const cards = [
        [
            "待识别 SO",
            pendingOrders.length,
            "/orders",
            "识别上传文件中的订单信息"
        ],
        [
            "需核对订单",
            parseReviewOrders.length,
            "/orders?review=1",
            "补全或确认关键信息"
        ],
        [
            "待联系客户",
            contactTasks.length || pendingConfirm,
            contactTasks.length ? "/contact-tasks" : "/orders",
            "确认开仓或装柜安排"
        ],
        [
            "待安排装柜",
            unplanned.length,
            "/plans",
            "为已确认柜子安排装柜"
        ],
        [
            "业务预警",
            alerts.length,
            "#business-alerts",
            "优先查看船期与截单风险"
        ]
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: "物流调度工作台",
                description: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].intro,
                    children: "从上方待办开始处理即可。船期、截止时间和派车变更均需人工确认后才会进入业务安排。"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 39,
                    columnNumber: 46
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 39,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].cards,
                children: cards.map(([title, count, href, detail])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].card,
                            count ? undefined : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].quiet
                        ].filter(Boolean).join(" "),
                        href: href,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].cardTitle,
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 40,
                                columnNumber: 193
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].number,
                                children: count
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 40,
                                columnNumber: 240
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: count ? detail : "当前无需处理"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 40,
                                columnNumber: 284
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].cardAction,
                                children: count ? "去处理 →" : "查看详情 →"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 40,
                                columnNumber: 326
                            }, this)
                        ]
                    }, title, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 40,
                        columnNumber: 80
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 40,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"]["dashboard-alerts"],
                id: "business-alerts",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"]["dashboard-alerts__heading"],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "业务预警"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 42,
                                        columnNumber: 73
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "预警仅用于提醒核对，不会自动改动船期、截止时间或装柜安排。"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 42,
                                        columnNumber: 86
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 42,
                                columnNumber: 68
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                tone: "warning",
                                children: [
                                    alerts.length,
                                    " 条待关注"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 42,
                                columnNumber: 128
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 42,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].alertList,
                        children: alerts.length ? alerts.map((alert, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].alertItem}${alert.severity === "CRITICAL" ? ` ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].critical}` : ""}`,
                                href: alert.href,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                        tone: alert.severity === "CRITICAL" ? "critical" : "warning",
                                        children: alertSeverityLabels[alert.severity]
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 44,
                                        columnNumber: 219
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: alert.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 44,
                                                columnNumber: 350
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: alert.detail
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 44,
                                                columnNumber: 370
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 44,
                                        columnNumber: 345
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].alertAction,
                                        children: "去核对 →"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 44,
                                        columnNumber: 397
                                    }, this)
                                ]
                            }, `${alert.orderId}-${alert.type}-${index}`, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 44,
                                columnNumber: 55
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"]["dashboard-alerts__empty"],
                            children: "暂无需要处理的预警。"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 44,
                            columnNumber: 454
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 43,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 41,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].taskGrid,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "待识别或核对"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 48,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].taskHint,
                                children: "打开 SO 后核对系统识别出的订单信息。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 48,
                                columnNumber: 31
                            }, this),
                            pendingOrders.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                children: pendingOrders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `/orders/${order.id}`,
                                                children: order.soNumber
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 48,
                                                columnNumber: 161
                                            }, this),
                                            " · ",
                                            order.carrier,
                                            " · ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2d$labels$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["statusLabel"])(order.parseStatus)
                                        ]
                                    }, order.id, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 48,
                                        columnNumber: 142
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 48,
                                columnNumber: 110
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "暂无待处理 SO。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 48,
                                columnNumber: 281
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 48,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "关键信息待确认"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 49,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].taskHint,
                                children: "补全缺失内容或确认存在差异的字段。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 49,
                                columnNumber: 32
                            }, this),
                            parseReviewOrders.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        children: parseReviewOrders.slice(0, 8).map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: `/orders/${order.id}`,
                                                        children: order.soNumber
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 49,
                                                        columnNumber: 181
                                                    }, this),
                                                    " · ",
                                                    order.reasons.join("；")
                                                ]
                                            }, order.id, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 49,
                                                columnNumber: 162
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 49,
                                        columnNumber: 114
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ButtonLink"], {
                                        variant: "secondary",
                                        size: "toolbar",
                                        href: "/orders?review=1",
                                        children: "查看全部待确认订单"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 49,
                                        columnNumber: 273
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "暂无字段冲突或缺失项。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 49,
                                columnNumber: 372
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 49,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "待匹配客户"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 50,
                                columnNumber: 16
                            }, this),
                            unmatchedOrders.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                children: unmatchedOrders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `/orders/${order.id}`,
                                                children: order.soNumber
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 50,
                                                columnNumber: 109
                                            }, this),
                                            " · ",
                                            order.carrier
                                        ]
                                    }, order.id, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 50,
                                        columnNumber: 90
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 50,
                                columnNumber: 56
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "暂无待匹配客户的 SO。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 50,
                                columnNumber: 194
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 50,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "待联系/确认"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 51,
                                columnNumber: 16
                            }, this),
                            contactTasks.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                children: contactTasks.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `/orders/${task.soOrder.id}`,
                                                children: task.soOrder.soNumber
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 51,
                                                columnNumber: 102
                                            }, this),
                                            " · 开仓 ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatChinaDateTime"])(task.dueAt)
                                        ]
                                    }, task.id, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 51,
                                        columnNumber: 84
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 51,
                                columnNumber: 54
                            }, this) : pendingConfirm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "有 ",
                                    pendingConfirm,
                                    " 个订单尚未完成柜量确认。",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "/orders",
                                        children: "查看订单"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 51,
                                        columnNumber: 273
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 51,
                                columnNumber: 239
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "暂无待联系或确认事项。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 51,
                                columnNumber: 306
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 51,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "靠港时间待确认"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 52,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].taskHint,
                                children: "确认船期变化后，再决定是否调整后续安排。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 52,
                                columnNumber: 32
                            }, this),
                            etbOrders.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                children: etbOrders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: order.sailing ? `/sailings/${order.sailing.id}` : `/orders/${order.id}`,
                                                children: order.soNumber
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 52,
                                                columnNumber: 154
                                            }, this),
                                            " · ",
                                            order.etbText || "预计靠港时间待确认"
                                        ]
                                    }, order.id, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 52,
                                        columnNumber: 135
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 52,
                                columnNumber: 107
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "暂无需要确认的靠港时间。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 52,
                                columnNumber: 304
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 52,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "船期更新需要协助"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 53,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].taskHint,
                                children: "部分船期信息无法自动取得，需要人工补充或再次查询。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 53,
                                columnNumber: 33
                            }, this),
                            etbHandoffs.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                children: etbHandoffs.map((run)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "/etb-runs",
                                                children: [
                                                    run.terminal,
                                                    " 船期更新"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 53,
                                                columnNumber: 160
                                            }, this),
                                            " · ",
                                            run.handoffReason || run.errorMessage || "请处理"
                                        ]
                                    }, run.id, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 53,
                                        columnNumber: 143
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 53,
                                columnNumber: 115
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "暂无需要人工协助的船期更新。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 53,
                                columnNumber: 269
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 53,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "已派车安排待确认"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 54,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].taskHint,
                                children: "靠港时间变化可能影响已安排的运输。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 54,
                                columnNumber: 33
                            }, this),
                            impactedTransport.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                children: impactedTransport.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "/plans",
                                                children: task.loadingPlan.soOrder.soNumber
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 54,
                                                columnNumber: 166
                                            }, this),
                                            " · 派车 ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatChinaDateTime"])(task.scheduledAt)
                                        ]
                                    }, task.id, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 54,
                                        columnNumber: 148
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 54,
                                columnNumber: 113
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "暂无需要确认的派车安排。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 54,
                                columnNumber: 282
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 54,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 47,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__12fb5d51._.js.map