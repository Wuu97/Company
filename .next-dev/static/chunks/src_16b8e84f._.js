(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/user-feedback.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
        return "暂时无法".concat(action, "，请检查当前信息后重试。");
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/feedback-message.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "error": "feedback-message-module__PXNC5G__error",
  "info": "feedback-message-module__PXNC5G__info",
  "message": "feedback-message-module__PXNC5G__message",
  "success": "feedback-message-module__PXNC5G__success",
  "warning": "feedback-message-module__PXNC5G__warning",
});
}),
"[project]/src/components/ui/feedback-message.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FeedbackMessage",
    ()=>FeedbackMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/feedback-message.module.css [app-client] (css module)");
;
;
function FeedbackMessage(param) {
    let { children, tone = "info", as: Tag = "p", className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].message,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"][tone],
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
_c = FeedbackMessage;
var _c;
__turbopack_context__.k.register(_c, "FeedbackMessage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/notification-read-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationReadButton",
    ()=>NotificationReadButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/user-feedback.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/feedback-message.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function NotificationReadButton(param) {
    let { id } = param;
    _s();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    async function read() {
        if (busy) return;
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch("/api/notifications/".concat(id, "/read"), {
                method: "POST"
            });
            if (response.ok) router.refresh();
            else setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userFeedback"].retry("更新消息状态"));
        } catch (e) {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                size: "small",
                onClick: read,
                disabled: busy,
                children: busy ? "正在更新…" : "标记已读"
            }, void 0, false, {
                fileName: "[project]/src/components/notification-read-button.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                tone: "error",
                as: "small",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/notification-read-button.tsx",
                lineNumber: 36,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true);
}
_s(NotificationReadButton, "+8Aj4aZMl7Vz3kIrbslOLqbIb5M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = NotificationReadButton;
var _c;
__turbopack_context__.k.register(_c, "NotificationReadButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_16b8e84f._.js.map