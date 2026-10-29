module.exports = [
"[project]/src/lib/time.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/user-feedback.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Reusable, business-facing feedback copy for client-side actions.
 * Keep API or infrastructure details out of the operator experience.
 */ __turbopack_context__.s([
    "userFeedback",
    ()=>userFeedback
]);
const userFeedback = {
    network: "网络连接异常，请检查后重试。",
    retry (action) {
        return `暂时无法${action}，请检查当前信息后重试。`;
    }
};
}),
"[project]/src/components/ui/form-feedback.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "form-feedback-module__cOIJ-G__actions",
  "message": "form-feedback-module__cOIJ-G__message",
});
}),
"[project]/src/components/ui/feedback-message.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "error": "feedback-message-module__PXNC5G__error",
  "info": "feedback-message-module__PXNC5G__info",
  "message": "feedback-message-module__PXNC5G__message",
  "success": "feedback-message-module__PXNC5G__success",
  "warning": "feedback-message-module__PXNC5G__warning",
});
}),
"[project]/src/components/ui/feedback-message.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FeedbackMessage",
    ()=>FeedbackMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/feedback-message.module.css [app-ssr] (css module)");
;
;
function FeedbackMessage({ children, tone = "info", as: Tag = "p", className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].message,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"][tone],
            className
        ].filter(Boolean).join(" "),
        role: tone === "error" ? "alert" : "status",
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/feedback-message.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/ui/form-feedback.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FormActions",
    ()=>FormActions,
    "FormMessage",
    ()=>FormMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$feedback$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-feedback.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/feedback-message.tsx [app-ssr] (ecmascript)");
;
;
;
function FormActions({ children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$feedback$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].actions,
            className
        ].filter(Boolean).join(" "),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/form-feedback.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
function FormMessage({ children, as = "p" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
        as: as,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$feedback$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].message,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/form-feedback.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/confirmation-panel.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "confirmation-panel-module__RGK18W__actions",
  "body": "confirmation-panel-module__RGK18W__body",
  "panel": "confirmation-panel-module__RGK18W__panel",
  "title": "confirmation-panel-module__RGK18W__title",
});
}),
"[project]/src/components/ui/confirmation-panel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConfirmationPanel",
    ()=>ConfirmationPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$confirmation$2d$panel$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/confirmation-panel.module.css [app-ssr] (css module)");
;
;
function ConfirmationPanel({ title, children, actions, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$confirmation$2d$panel$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].panel,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$confirmation$2d$panel$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].title,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                    children: title
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/confirmation-panel.tsx",
                    lineNumber: 8,
                    columnNumber: 107
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/confirmation-panel.tsx",
                lineNumber: 8,
                columnNumber: 79
            }, this),
            children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$confirmation$2d$panel$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].body,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/confirmation-panel.tsx",
                lineNumber: 8,
                columnNumber: 138
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$confirmation$2d$panel$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].actions,
                children: actions
            }, void 0, false, {
                fileName: "[project]/src/components/ui/confirmation-panel.tsx",
                lineNumber: 8,
                columnNumber: 184
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/confirmation-panel.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/ui/form-field.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "checkbox": "form-field-module__WhHEnW__checkbox",
  "control": "form-field-module__WhHEnW__control",
  "dateTime": "form-field-module__WhHEnW__dateTime",
  "error": "form-field-module__WhHEnW__error",
  "field": "form-field-module__WhHEnW__field",
  "select": "form-field-module__WhHEnW__select",
});
}),
"[project]/src/components/ui/form-field.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FormField",
    ()=>FormField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-field.module.css [app-ssr] (css module)");
;
;
function FormField({ label, children, hint, required, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].field,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                        "aria-hidden": "true",
                        children: " *"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/form-field.tsx",
                        lineNumber: 8,
                        columnNumber: 107
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/form-field.tsx",
                lineNumber: 8,
                columnNumber: 81
            }, this),
            children,
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                children: hint
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-field.tsx",
                lineNumber: 8,
                columnNumber: 164
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form-field.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/ui/list.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "list-module__hpCqyG__actions",
  "clear": "list-module__hpCqyG__clear",
  "control": "list-module__hpCqyG__control",
  "controlCompact": "list-module__hpCqyG__controlCompact",
  "field": "list-module__hpCqyG__field",
  "filter": "list-module__hpCqyG__filter",
  "pagination": "list-module__hpCqyG__pagination",
  "search": "list-module__hpCqyG__search",
  "select": "list-module__hpCqyG__select",
  "selectChevron": "list-module__hpCqyG__selectChevron",
  "selectOption": "list-module__hpCqyG__selectOption",
  "selectOptionCompact": "list-module__hpCqyG__selectOptionCompact",
  "selectOptions": "list-module__hpCqyG__selectOptions",
  "selectTrigger": "list-module__hpCqyG__selectTrigger",
  "selectTriggerCompact": "list-module__hpCqyG__selectTriggerCompact",
  "summary": "list-module__hpCqyG__summary",
});
}),
"[project]/src/components/ui/filter-select.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FilterSelect",
    ()=>FilterSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/list.module.css [app-ssr] (css module)");
"use client";
;
;
;
function optionsFrom(children) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Children"].toArray(children).flatMap((child)=>{
        if (!/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"])(child)) return [];
        return [
            {
                value: child.props.value || "",
                label: child.props.children,
                disabled: child.props.disabled
            }
        ];
    });
}
function FilterSelect({ children, className, triggerClassName, optionsClassName, optionClassName, defaultValue, value: controlledValue, name, disabled, onChange, onBlur, required, autoFocus, "aria-label": ariaLabel, "aria-invalid": ariaInvalid }) {
    const options = optionsFrom(children);
    const initialValue = String(controlledValue ?? defaultValue ?? options[0]?.value ?? "");
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialValue);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const listId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const selected = options.find((option)=>option.value === value) || options[0];
    const isControlled = controlledValue !== undefined;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isControlled) setValue(String(controlledValue));
    }, [
        controlledValue,
        isControlled
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        const closeWhenOutside = (event)=>{
            if (!rootRef.current?.contains(event.target)) setOpen(false);
        };
        document.addEventListener("pointerdown", closeWhenOutside);
        return ()=>document.removeEventListener("pointerdown", closeWhenOutside);
    }, [
        open
    ]);
    const choose = (nextValue)=>{
        if (!isControlled) setValue(nextValue);
        if (inputRef.current) inputRef.current.value = nextValue;
        setOpen(false);
        onChange?.({
            target: {
                value: nextValue,
                name
            },
            currentTarget: {
                value: nextValue,
                name
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].select,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: inputRef,
                type: "hidden",
                name: name,
                value: isControlled ? String(controlledValue ?? "") : value,
                required: required
            }, void 0, false, {
                fileName: "[project]/src/components/ui/filter-select.tsx",
                lineNumber: 57,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].selectTrigger,
                    triggerClassName
                ].filter(Boolean).join(" "),
                disabled: disabled,
                autoFocus: autoFocus,
                "aria-label": ariaLabel,
                "aria-invalid": ariaInvalid,
                "aria-haspopup": "listbox",
                "aria-expanded": open,
                "aria-controls": listId,
                onClick: ()=>setOpen((current)=>!current),
                onBlur: (event)=>onBlur?.(event),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: selected?.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/filter-select.tsx",
                        lineNumber: 59,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].selectChevron,
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/filter-select.tsx",
                        lineNumber: 59,
                        columnNumber: 37
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/filter-select.tsx",
                lineNumber: 58,
                columnNumber: 5
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: listId,
                className: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].selectOptions,
                    optionsClassName
                ].filter(Boolean).join(" "),
                role: "listbox",
                "aria-label": ariaLabel,
                children: options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        role: "option",
                        "aria-selected": option.value === value,
                        className: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].selectOption,
                            optionClassName
                        ].filter(Boolean).join(" "),
                        disabled: option.disabled,
                        onMouseDown: (event)=>event.preventDefault(),
                        onClick: ()=>choose(option.value),
                        children: option.label
                    }, option.value, false, {
                        fileName: "[project]/src/components/ui/filter-select.tsx",
                        lineNumber: 62,
                        columnNumber: 30
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/filter-select.tsx",
                lineNumber: 61,
                columnNumber: 14
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/filter-select.tsx",
        lineNumber: 56,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/ui/date-time-field.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "calendarButton": "date-time-field-module__avjjUa__calendarButton",
  "calendarFooter": "date-time-field-module__avjjUa__calendarFooter",
  "calendarHeader": "date-time-field-module__avjjUa__calendarHeader",
  "calendarMonth": "date-time-field-module__avjjUa__calendarMonth",
  "calendarNav": "date-time-field-module__avjjUa__calendarNav",
  "dateInput": "date-time-field-module__avjjUa__dateInput",
  "dateZone": "date-time-field-module__avjjUa__dateZone",
  "day": "date-time-field-module__avjjUa__day",
  "days": "date-time-field-module__avjjUa__days",
  "editor": "date-time-field-module__avjjUa__editor",
  "invalid": "date-time-field-module__avjjUa__invalid",
  "outside": "date-time-field-module__avjjUa__outside",
  "popover": "date-time-field-module__avjjUa__popover",
  "root": "date-time-field-module__avjjUa__root",
  "selected": "date-time-field-module__avjjUa__selected",
  "timeActions": "date-time-field-module__avjjUa__timeActions",
  "timeFields": "date-time-field-module__avjjUa__timeFields",
  "timePopover": "date-time-field-module__avjjUa__timePopover",
  "timeSelector": "date-time-field-module__avjjUa__timeSelector",
  "today": "date-time-field-module__avjjUa__today",
  "weekdays": "date-time-field-module__avjjUa__weekdays",
});
}),
"[project]/src/components/ui/date-time-field.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DateTimeField",
    ()=>DateTimeField,
    "DateTimeInput",
    ()=>DateTimeInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/date-time-field.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
function splitValue(value) {
    const match = /^(\d{4}-\d{2}-\d{2})(?:T| )(\d{2}:\d{2})$/.exec(value);
    return {
        date: match?.[1] || "",
        time: match?.[2] || ""
    };
}
function validDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;
    const [, year, month, day] = match;
    return Number(month) >= 1 && Number(month) <= 12 && Number(day) >= 1 && Number(day) <= new Date(Number(year), Number(month), 0).getDate();
}
function validTime(value) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}
function combine(date, time) {
    return validDate(date) && validTime(time) ? `${date}T${time}` : "";
}
function monthTitle(date) {
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, "0")}月`;
}
function dayKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function formatDateInput(value) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}
function CalendarPopover({ anchor, value, onSelect, onClose }) {
    const selected = validDate(value) ? new Date(`${value}T00:00:00`) : new Date();
    const [month, setMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new Date(selected.getFullYear(), selected.getMonth(), 1));
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        top: 8,
        left: 8
    });
    const popoverRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const today = dayKey(new Date());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const place = ()=>{
            const rect = anchor.getBoundingClientRect();
            const width = Math.min(252, window.innerWidth - 16);
            const estimatedHeight = 250;
            const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
            const below = rect.bottom + 6;
            const top = below + estimatedHeight <= window.innerHeight ? below : Math.max(8, rect.top - estimatedHeight - 6);
            setPosition({
                top,
                left
            });
        };
        place();
        window.addEventListener("resize", place);
        window.addEventListener("scroll", place, true);
        return ()=>{
            window.removeEventListener("resize", place);
            window.removeEventListener("scroll", place, true);
        };
    }, [
        anchor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const closeOutside = (event)=>{
            const target = event.target;
            if (!popoverRef.current?.contains(target) && !anchor.contains(target)) onClose();
        };
        const closeEscape = (event)=>{
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("pointerdown", closeOutside);
        document.addEventListener("keydown", closeEscape);
        return ()=>{
            document.removeEventListener("pointerdown", closeOutside);
            document.removeEventListener("keydown", closeEscape);
        };
    }, [
        anchor,
        onClose
    ]);
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    const days = Array.from({
        length: 42
    }, (_, index)=>{
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        return date;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: popoverRef,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].popover,
        style: position,
        role: "dialog",
        "aria-label": "选择日期",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].calendarHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].calendarMonth,
                        children: monthTitle(month)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].calendarNav,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-label": "上个月",
                                onClick: ()=>setMonth((current)=>new Date(current.getFullYear(), current.getMonth() - 1, 1)),
                                children: "‹"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/date-time-field.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-label": "下个月",
                                onClick: ()=>setMonth((current)=>new Date(current.getFullYear(), current.getMonth() + 1, 1)),
                                children: "›"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/date-time-field.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekdays,
                children: [
                    "日",
                    "一",
                    "二",
                    "三",
                    "四",
                    "五",
                    "六"
                ].map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: day
                    }, day, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 102,
                        columnNumber: 88
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].days,
                children: days.map((date)=>{
                    const key = dayKey(date);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].day,
                            date.getMonth() !== month.getMonth() ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].outside : undefined,
                            key === value ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].selected : undefined,
                            key === today ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].today : undefined
                        ].filter(Boolean).join(" "),
                        onClick: ()=>{
                            onSelect(key);
                            onClose();
                        },
                        children: date.getDate()
                    }, key, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 105,
                        columnNumber: 16
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].calendarFooter,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>{
                            onSelect("");
                            onClose();
                        },
                        children: "清除"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 107,
                        columnNumber: 46
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>{
                            onSelect(today);
                            onClose();
                        },
                        children: "今天"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 107,
                        columnNumber: 124
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/date-time-field.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this), document.body);
}
function TimePopover({ anchor, value, onSelect, onClose }) {
    const initial = validTime(value) ? value : "00:00";
    const [hour, setHour] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initial.slice(0, 2));
    const [minute, setMinute] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initial.slice(3, 5));
    const popoverRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        top: 8,
        left: 8
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const place = ()=>{
            const rect = anchor.getBoundingClientRect();
            const width = 158;
            const height = 102;
            const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
            const below = rect.bottom + 6;
            setPosition({
                left,
                top: below + height <= window.innerHeight ? below : Math.max(8, rect.top - height - 6)
            });
        };
        place();
        window.addEventListener("resize", place);
        window.addEventListener("scroll", place, true);
        return ()=>{
            window.removeEventListener("resize", place);
            window.removeEventListener("scroll", place, true);
        };
    }, [
        anchor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const closeOutside = (event)=>{
            const target = event.target;
            if (!popoverRef.current?.contains(target) && !anchor.contains(target)) onClose();
        };
        const closeEscape = (event)=>{
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("pointerdown", closeOutside);
        document.addEventListener("keydown", closeEscape);
        return ()=>{
            document.removeEventListener("pointerdown", closeOutside);
            document.removeEventListener("keydown", closeEscape);
        };
    }, [
        anchor,
        onClose
    ]);
    const confirm = ()=>{
        const next = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
        if (!validTime(next)) return;
        onSelect(next);
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: popoverRef,
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].popover} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timePopover}`,
        style: position,
        role: "dialog",
        "aria-label": "选择时间",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                children: "选择时间（24 小时制）"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeFields,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        "aria-label": "小时",
                        inputMode: "numeric",
                        maxLength: 2,
                        value: hour,
                        onChange: (event)=>setHour(event.target.value.replace(/\D/g, "").slice(0, 2)),
                        onKeyDown: (event)=>{
                            if (event.key === "Enter") confirm();
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: ":"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        "aria-label": "分钟",
                        inputMode: "numeric",
                        maxLength: 2,
                        value: minute,
                        onChange: (event)=>setMinute(event.target.value.replace(/\D/g, "").slice(0, 2)),
                        onKeyDown: (event)=>{
                            if (event.key === "Enter") confirm();
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeActions,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onClose,
                        children: "取消"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 161,
                        columnNumber: 43
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: confirm,
                        children: "确认"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 161,
                        columnNumber: 94
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/date-time-field.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this), document.body);
}
const DateTimeInput = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(function DateTimeInput({ value, onValueChange, onCommit, className, disabled, required, name, onBlur, onFocus, ...props }, ref) {
    const { date: valueDate, time: valueTime } = splitValue(value);
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(valueDate);
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(valueTime);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [timeOpen, setTimeOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const calendarButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timeButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dateInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const currentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        date: valueDate,
        time: valueTime
    });
    const inputId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setDate(valueDate);
        setTime(valueTime);
        currentRef.current = {
            date: valueDate,
            time: valueTime
        };
    }, [
        valueDate,
        valueTime
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        dateInputRef.current?.setCustomValidity(required && !validTime(time) ? "请选择时间。" : "");
    }, [
        required,
        time
    ]);
    const update = (nextDate, nextTime)=>{
        currentRef.current = {
            date: nextDate,
            time: nextTime
        };
        setDate(nextDate);
        setTime(nextTime);
        onValueChange(combine(nextDate, nextTime));
    };
    const commit = (nextDate = currentRef.current.date, nextTime = currentRef.current.time)=>onCommit?.(combine(nextDate, nextTime));
    const handleBlur = (event)=>{
        onBlur?.(event);
        window.setTimeout(()=>{
            if (!rootRef.current?.contains(document.activeElement)) commit();
        }, 0);
    };
    const invalid = Boolean((date || time) && (!validDate(date) || !validTime(time)));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].root,
            invalid ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].invalid : undefined,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].editor,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dateZone,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: (node)=>{
                                    dateInputRef.current = node;
                                    if (typeof ref === "function") ref(node);
                                    else if (ref) ref.current = node;
                                },
                                id: inputId,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dateInput,
                                value: date,
                                name: undefined,
                                disabled: disabled,
                                required: required,
                                inputMode: "numeric",
                                autoComplete: "off",
                                placeholder: "YYYY-MM-DD",
                                "aria-label": "日期",
                                "aria-invalid": invalid || undefined,
                                pattern: "\\\\d{4}-\\\\d{2}-\\\\d{2}",
                                onChange: (event)=>update(formatDateInput(event.target.value), time),
                                onBlur: handleBlur,
                                onFocus: onFocus,
                                ...props
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/date-time-field.tsx",
                                lineNumber: 198,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                ref: calendarButtonRef,
                                type: "button",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].calendarButton,
                                disabled: disabled,
                                "aria-label": "打开日历",
                                "aria-expanded": open,
                                onClick: ()=>setOpen((current)=>!current),
                                children: "▣"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/date-time-field.tsx",
                                lineNumber: 199,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 197,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        ref: timeButtonRef,
                        type: "button",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeSelector,
                        disabled: disabled,
                        "aria-label": "选择时间",
                        "aria-expanded": timeOpen,
                        onClick: ()=>setTimeOpen((current)=>!current),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: time || "HH:mm"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/date-time-field.tsx",
                                lineNumber: 201,
                                columnNumber: 193
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                "aria-hidden": "true",
                                children: "◷"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/date-time-field.tsx",
                                lineNumber: 201,
                                columnNumber: 223
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 201,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 196,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "hidden",
                name: name,
                value: combine(date, time)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 203,
                columnNumber: 5
            }, this),
            open && calendarButtonRef.current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CalendarPopover, {
                anchor: calendarButtonRef.current,
                value: date,
                onSelect: (nextDate)=>{
                    const nextTime = time || "00:00";
                    update(nextDate, nextTime);
                    window.setTimeout(()=>commit(nextDate, nextTime), 0);
                },
                onClose: ()=>setOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 204,
                columnNumber: 43
            }, this),
            timeOpen && timeButtonRef.current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TimePopover, {
                anchor: timeButtonRef.current,
                value: time,
                onSelect: (nextTime)=>{
                    update(date, nextTime);
                    window.setTimeout(()=>commit(date, nextTime), 0);
                },
                onClose: ()=>setTimeOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 205,
                columnNumber: 43
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/date-time-field.tsx",
        lineNumber: 195,
        columnNumber: 10
    }, this);
});
function DateTimeField({ type: _type, defaultValue, value, onChange, ...props }) {
    const [internalValue, setInternalValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(String(value ?? defaultValue ?? ""));
    const controlled = value !== undefined;
    const currentValue = controlled ? String(value ?? "") : internalValue;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DateTimeInput, {
        ...props,
        value: currentValue,
        onValueChange: (nextValue)=>{
            if (!controlled) setInternalValue(nextValue);
            onChange?.({
                target: {
                    value: nextValue,
                    name: props.name || ""
                },
                currentTarget: {
                    value: nextValue,
                    name: props.name || ""
                }
            });
        }
    }, void 0, false, {
        fileName: "[project]/src/components/ui/date-time-field.tsx",
        lineNumber: 213,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/ui/form-controls.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckboxField",
    ()=>CheckboxField,
    "SelectField",
    ()=>SelectField,
    "TextField",
    ()=>TextField,
    "TextareaField",
    ()=>TextareaField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-field.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-field.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/filter-select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/date-time-field.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
function TextField({ label, hint, error, className, required, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
        label: label,
        hint: hint,
        required: required,
        className: className,
        children: [
            props.type === "datetime-local" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DateTimeField"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dateTime,
                required: required,
                "aria-invalid": Boolean(error) || undefined,
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 27,
                columnNumber: 124
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].control,
                required: required,
                "aria-invalid": Boolean(error) || undefined,
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 27,
                columnNumber: 246
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].error,
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 27,
                columnNumber: 367
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form-controls.tsx",
        lineNumber: 27,
        columnNumber: 10
    }, this);
}
function SelectField({ label, hint, error, className, required, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
        label: label,
        hint: hint,
        required: required,
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FilterSelect"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].select,
                triggerClassName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].control,
                required: required,
                "aria-invalid": Boolean(error) || undefined,
                ...props,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 32,
                columnNumber: 89
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].error,
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 32,
                columnNumber: 272
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form-controls.tsx",
        lineNumber: 32,
        columnNumber: 10
    }, this);
}
function TextareaField({ label, hint, error, className, required, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
        label: label,
        hint: hint,
        required: required,
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].control,
                required: required,
                "aria-invalid": Boolean(error) || undefined,
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 37,
                columnNumber: 89
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].error,
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 37,
                columnNumber: 212
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form-controls.tsx",
        lineNumber: 37,
        columnNumber: 10
    }, this);
}
function CheckboxField({ children, hint, className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].checkbox,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "checkbox",
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 48,
                columnNumber: 84
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 48,
                columnNumber: 120
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                children: hint
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 48,
                columnNumber: 152
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form-controls.tsx",
        lineNumber: 48,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/ui/disclosure.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "content": "disclosure-module___9sabG__content",
  "disclosure": "disclosure-module___9sabG__disclosure",
  "summary": "disclosure-module___9sabG__summary",
});
}),
"[project]/src/components/ui/disclosure.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Disclosure",
    ()=>Disclosure
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/disclosure.module.css [app-ssr] (css module)");
;
;
function Disclosure({ title, children, className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].disclosure,
            className
        ].filter(Boolean).join(" "),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].summary,
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/disclosure.tsx",
                lineNumber: 5,
                columnNumber: 99
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].content,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/disclosure.tsx",
                lineNumber: 5,
                columnNumber: 152
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/disclosure.tsx",
        lineNumber: 5,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/sailing-forms.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdoptEtbButton",
    ()=>AdoptEtbButton,
    "EtbObservationForm",
    ()=>EtbObservationForm,
    "SailingForm",
    ()=>SailingForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/business.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/time.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/user-feedback.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$feedback$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-feedback.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$confirmation$2d$panel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/confirmation-panel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-controls.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/disclosure.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/feedback-message.tsx [app-ssr] (ecmascript)");
"use client";
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
;
function SailingForm() {
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        setBusy(true);
        setMessage("");
        try {
            const data = Object.fromEntries(new FormData(event.currentTarget));
            const response = await fetch("/api/sailings", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    ...data,
                    manualSupplement: true
                })
            });
            if (response.ok) {
                setMessage("人工补录船期已创建。");
                event.currentTarget.reset();
                router.refresh();
            } else {
                const body = await response.json().catch(()=>({}));
                setMessage(body.error || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].retry("补录船期"));
            }
        } catch  {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Disclosure"], {
            title: "人工补录船期（仅 SO 自动归集异常时使用）",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["muted"],
                    children: "正常情况下，请先核对 SO；船名、航次和装货港齐全后系统会自动归集船期。仅在无法通过 SO 补齐或重新核对时，才在此补录，并填写原因。"
                }, void 0, false, {
                    fileName: "[project]/src/components/sailing-forms.tsx",
                    lineNumber: 18,
                    columnNumber: 62
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["sailing-form"],
                    onSubmit: submit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                            label: "码头",
                            name: "terminal",
                            placeholder: "如：盐田",
                            required: true,
                            disabled: busy
                        }, void 0, false, {
                            fileName: "[project]/src/components/sailing-forms.tsx",
                            lineNumber: 18,
                            columnNumber: 239
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                            label: "装货港",
                            name: "loadPort",
                            placeholder: "如：盐田港",
                            required: true,
                            disabled: busy
                        }, void 0, false, {
                            fileName: "[project]/src/components/sailing-forms.tsx",
                            lineNumber: 18,
                            columnNumber: 322
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                            label: "船公司",
                            name: "carrier",
                            required: true,
                            disabled: busy
                        }, void 0, false, {
                            fileName: "[project]/src/components/sailing-forms.tsx",
                            lineNumber: 18,
                            columnNumber: 407
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                            label: "船名",
                            name: "vesselName",
                            required: true,
                            disabled: busy
                        }, void 0, false, {
                            fileName: "[project]/src/components/sailing-forms.tsx",
                            lineNumber: 18,
                            columnNumber: 471
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                            label: "航次",
                            name: "voyage",
                            required: true,
                            disabled: busy
                        }, void 0, false, {
                            fileName: "[project]/src/components/sailing-forms.tsx",
                            lineNumber: 18,
                            columnNumber: 537
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                            label: "补录原因",
                            name: "manualReason",
                            placeholder: "例如：历史 SO 无法补齐船期资料",
                            required: true,
                            disabled: busy
                        }, void 0, false, {
                            fileName: "[project]/src/components/sailing-forms.tsx",
                            lineNumber: 18,
                            columnNumber: 599
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$feedback$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormActions"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "submit",
                                wide: "mobile",
                                disabled: busy,
                                children: busy ? "补录中…" : "确认人工补录"
                            }, void 0, false, {
                                fileName: "[project]/src/components/sailing-forms.tsx",
                                lineNumber: 18,
                                columnNumber: 714
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/sailing-forms.tsx",
                            lineNumber: 18,
                            columnNumber: 701
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/sailing-forms.tsx",
                    lineNumber: 18,
                    columnNumber: 172
                }, this),
                message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$feedback$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormMessage"], {
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/components/sailing-forms.tsx",
                    lineNumber: 18,
                    columnNumber: 834
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/sailing-forms.tsx",
            lineNumber: 18,
            columnNumber: 19
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/sailing-forms.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
function EtbObservationForm({ sailingId }) {
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        const form = event.currentTarget;
        const data = new FormData(form);
        const date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chinaLocalDateTimeToDate"])(String(data.get("etbAt") || ""));
        if (!date) {
            setMessage("请选择有效的预计靠港时间。");
            return;
        }
        data.set("etbAt", date.toISOString());
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch(`/api/sailings/${sailingId}/observations`, {
                method: "POST",
                body: data
            });
            if (response.ok) {
                setMessage("预计靠港时间已保存，等待人工确认；不会自动改变当前业务安排。");
                form.reset();
                router.refresh();
            } else setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].retry("保存预计靠港时间"));
        } catch  {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "录入预计靠港时间"
            }, void 0, false, {
                fileName: "[project]/src/components/sailing-forms.tsx",
                lineNumber: 24,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["muted"],
                children: "先填写时间与核对依据；链接、截图和备注仅在需要留档时补充。保存后不会自动改变当前业务安排。"
            }, void 0, false, {
                fileName: "[project]/src/components/sailing-forms.tsx",
                lineNumber: 24,
                columnNumber: 36
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["etb-observation-form"],
                onSubmit: submit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["etb-observation-form__core"],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                                label: "预计靠港时间",
                                name: "etbAt",
                                type: "datetime-local",
                                required: true,
                                disabled: busy
                            }, void 0, false, {
                                fileName: "[project]/src/components/sailing-forms.tsx",
                                lineNumber: 24,
                                columnNumber: 261
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                                label: "时间依据",
                                name: "source",
                                placeholder: "例如：船公司电话确认",
                                required: true,
                                disabled: busy
                            }, void 0, false, {
                                fileName: "[project]/src/components/sailing-forms.tsx",
                                lineNumber: 24,
                                columnNumber: 348
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sailing-forms.tsx",
                        lineNumber: 24,
                        columnNumber: 199
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Disclosure"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["etb-observation-form__optional"],
                        title: "补充核对材料（可选）",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                                    label: "来源网址",
                                    name: "sourceUrl",
                                    type: "url",
                                    disabled: busy
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sailing-forms.tsx",
                                    lineNumber: 24,
                                    columnNumber: 540
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                                    label: "依据截图",
                                    name: "evidence",
                                    type: "file",
                                    accept: "image/png,image/jpeg,image/webp",
                                    hint: "PNG、JPG、WebP，最大 5MB",
                                    disabled: busy
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sailing-forms.tsx",
                                    lineNumber: 24,
                                    columnNumber: 609
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                                    label: "备注",
                                    name: "note",
                                    disabled: busy
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sailing-forms.tsx",
                                    lineNumber: 24,
                                    columnNumber: 746
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/sailing-forms.tsx",
                            lineNumber: 24,
                            columnNumber: 535
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/sailing-forms.tsx",
                        lineNumber: 24,
                        columnNumber: 443
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$feedback$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormActions"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            wide: "mobile",
                            disabled: busy,
                            children: busy ? "正在保存…" : "保存待确认时间"
                        }, void 0, false, {
                            fileName: "[project]/src/components/sailing-forms.tsx",
                            lineNumber: 24,
                            columnNumber: 829
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/sailing-forms.tsx",
                        lineNumber: 24,
                        columnNumber: 816
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sailing-forms.tsx",
                lineNumber: 24,
                columnNumber: 124
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$feedback$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormMessage"], {
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/sailing-forms.tsx",
                lineNumber: 24,
                columnNumber: 951
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sailing-forms.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
function AdoptEtbButton({ url }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [note, setNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    async function adopt() {
        if (busy) return;
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    note: note.trim() || undefined
                })
            });
            if (response.ok) {
                setOpen(false);
                router.refresh();
            } else setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].retry("确认此预计靠港时间"));
        } catch  {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["etb-adopt"],
        children: [
            !open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                onClick: ()=>setOpen(true),
                children: "确认采用此时间"
            }, void 0, false, {
                fileName: "[project]/src/components/sailing-forms.tsx",
                lineNumber: 30,
                columnNumber: 64
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$confirmation$2d$panel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfirmationPanel"], {
                title: "确认采用此预计靠港时间？",
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            wide: "mobile",
                            disabled: busy,
                            onClick: adopt,
                            children: busy ? "正在确认…" : "确认采用"
                        }, void 0, false, {
                            fileName: "[project]/src/components/sailing-forms.tsx",
                            lineNumber: 30,
                            columnNumber: 172
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "neutral",
                            wide: "mobile",
                            disabled: busy,
                            onClick: ()=>setOpen(false),
                            children: "返回"
                        }, void 0, false, {
                            fileName: "[project]/src/components/sailing-forms.tsx",
                            lineNumber: 30,
                            columnNumber: 260
                        }, void 0)
                    ]
                }, void 0, true),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "采用后将用于当前业务安排，后续新时间仍需人工确认。"
                    }, void 0, false, {
                        fileName: "[project]/src/components/sailing-forms.tsx",
                        lineNumber: 30,
                        columnNumber: 363
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                        label: "确认说明（可选）",
                        value: note,
                        onChange: (event)=>setNote(event.target.value),
                        disabled: busy,
                        placeholder: "例如：已与船公司核实"
                    }, void 0, false, {
                        fileName: "[project]/src/components/sailing-forms.tsx",
                        lineNumber: 30,
                        columnNumber: 395
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sailing-forms.tsx",
                lineNumber: 30,
                columnNumber: 121
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                tone: "error",
                as: "small",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/sailing-forms.tsx",
                lineNumber: 30,
                columnNumber: 559
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sailing-forms.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/bulk-etb-query-form.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BulkEtbQueryForm",
    ()=>BulkEtbQueryForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/business.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/user-feedback.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-controls.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/feedback-message.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function BulkEtbQueryForm({ orders }) {
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const selectedSet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new Set(selected), [
        selected
    ]);
    const allSelected = orders.length > 0 && selected.length === orders.length;
    function toggle(id) {
        setSelected((current)=>current.includes(id) ? current.filter((value)=>value !== id) : [
                ...current,
                id
            ]);
    }
    function toggleAll() {
        setSelected(allSelected ? [] : orders.map((order)=>order.id));
    }
    async function submit() {
        if (!selected.length || busy) return;
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch("/api/orders/etb-query/bulk", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    orderIds: selected
                })
            });
            const body = await response.json().catch(()=>({}));
            if (response.ok) {
                const skipped = body.skipped?.length ? `，其中 ${body.skipped.length} 单已有相同船期的更新安排` : "";
                setMessage(`已安排更新 ${body.queuedOrderCount || 0} 单的预计靠港时间${skipped}。`);
                setSelected([]);
            } else {
                setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].retry("安排船期更新"));
            }
        } catch  {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    if (!orders.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["schedule-update"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "更新预计靠港时间"
            }, void 0, false, {
                fileName: "[project]/src/components/bulk-etb-query-form.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["muted"],
                children: "选择需要更新船期的 SO。相同船期只会更新一次，更新结果仍需人工确认后才会影响业务安排。"
            }, void 0, false, {
                fileName: "[project]/src/components/bulk-etb-query-form.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["schedule-update__toolbar"],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckboxField"], {
                        checked: allSelected,
                        disabled: busy,
                        onChange: toggleAll,
                        children: "全选本页"
                    }, void 0, false, {
                        fileName: "[project]/src/components/bulk-etb-query-form.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "已选 ",
                            selected.length,
                            " 单"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/bulk-etb-query-form.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/bulk-etb-query-form.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["schedule-update__options"],
                children: orders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckboxField"], {
                        checked: selectedSet.has(order.id),
                        disabled: busy,
                        onChange: ()=>toggle(order.id),
                        children: order.label
                    }, order.id, false, {
                        fileName: "[project]/src/components/bulk-etb-query-form.tsx",
                        lineNumber: 63,
                        columnNumber: 30
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/bulk-etb-query-form.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["schedule-update__actions"],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        wide: "mobile",
                        disabled: !selected.length || busy,
                        onClick: submit,
                        children: busy ? "正在安排…" : `更新所选 SO（${selected.length}）`
                    }, void 0, false, {
                        fileName: "[project]/src/components/bulk-etb-query-form.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                        as: "span",
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/src/components/bulk-etb-query-form.tsx",
                        lineNumber: 67,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/bulk-etb-query-form.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/bulk-etb-query-form.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_11f85c18._.js.map