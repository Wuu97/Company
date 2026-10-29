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
"[project]/src/components/ui/dialog.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "dialog-module__yini9G__actions",
  "backdrop": "dialog-module__yini9G__backdrop",
  "body": "dialog-module__yini9G__body",
  "danger": "dialog-module__yini9G__danger",
  "dialog": "dialog-module__yini9G__dialog",
  "message": "dialog-module__yini9G__message",
  "title": "dialog-module__yini9G__title",
});
}),
"[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([type='hidden']):not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
].join(",");
function Dialog(param) {
    let { title, children, actions, onClose, tone = "default", message, closeDisabled = false } = param;
    _s();
    const dialogRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const openerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const onCloseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onClose);
    const closeDisabledRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(closeDisabled);
    const titleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const descriptionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    onCloseRef.current = onClose;
    closeDisabledRef.current = closeDisabled;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dialog.useEffect": ()=>{
            var _this;
            openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            const dialog = dialogRef.current;
            const firstFocusable = dialog === null || dialog === void 0 ? void 0 : dialog.querySelector(focusableSelector);
            (_this = firstFocusable || dialog) === null || _this === void 0 ? void 0 : _this.focus();
            function onKeyDown(event) {
                if (event.key === "Escape" && !closeDisabledRef.current) {
                    event.preventDefault();
                    onCloseRef.current();
                    return;
                }
                if (event.key !== "Tab" || !dialog) return;
                const focusable = Array.from(dialog.querySelectorAll(focusableSelector));
                if (!focusable.length) {
                    event.preventDefault();
                    dialog.focus();
                    return;
                }
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
            document.addEventListener("keydown", onKeyDown);
            return ({
                "Dialog.useEffect": ()=>{
                    var _openerRef_current;
                    document.removeEventListener("keydown", onKeyDown);
                    if ((_openerRef_current = openerRef.current) === null || _openerRef_current === void 0 ? void 0 : _openerRef_current.isConnected) openerRef.current.focus();
                }
            })["Dialog.useEffect"];
        }
    }["Dialog.useEffect"], []);
    function closeFromBackdrop(event) {
        if (event.target === event.currentTarget && !closeDisabled) onClose();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].backdrop,
        onMouseDown: closeFromBackdrop,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: dialogRef,
            className: [
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dialog,
                tone === "danger" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].danger : undefined
            ].filter(Boolean).join(" "),
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": titleId,
            "aria-describedby": descriptionId,
            tabIndex: -1,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                    id: titleId,
                    children: title
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dialog.tsx",
                    lineNumber: 80,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].body,
                    id: descriptionId,
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dialog.tsx",
                    lineNumber: 81,
                    columnNumber: 7
                }, this),
                message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].message,
                    role: "status",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dialog.tsx",
                    lineNumber: 82,
                    columnNumber: 19
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actions,
                    children: actions
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dialog.tsx",
                    lineNumber: 83,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.tsx",
            lineNumber: 79,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 78,
        columnNumber: 10
    }, this);
}
_s(Dialog, "/nEpr9FGGn5G0WWa1OfcR6w82JE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = Dialog;
var _c;
__turbopack_context__.k.register(_c, "Dialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/delete-confirm-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeleteConfirmDialog",
    ()=>DeleteConfirmDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function DeleteConfirmDialog(param) {
    let { title, children, message, busy = false, onClose, onConfirm, confirmingLabel = "正在删除…" } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        tone: "danger",
        title: title,
        message: message,
        closeDisabled: busy,
        onClose: onClose,
        actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    type: "button",
                    variant: "neutral",
                    size: "small",
                    wide: "mobile",
                    disabled: busy,
                    onClick: onClose,
                    children: "返回"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/delete-confirm-dialog.tsx",
                    lineNumber: 19,
                    columnNumber: 114
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    type: "button",
                    variant: "danger",
                    size: "small",
                    wide: "mobile",
                    disabled: busy,
                    onClick: onConfirm,
                    children: busy ? confirmingLabel : "确认删除"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/delete-confirm-dialog.tsx",
                    lineNumber: 19,
                    columnNumber: 226
                }, void 0)
            ]
        }, void 0, true),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/delete-confirm-dialog.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, this);
}
_c = DeleteConfirmDialog;
var _c;
__turbopack_context__.k.register(_c, "DeleteConfirmDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/delete-order-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeleteOrderButton",
    ()=>DeleteOrderButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/user-feedback.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$delete$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/delete-confirm-dialog.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function DeleteOrderButton(param) {
    let { orderId, returnToOrders = false, size = "default", className } = param;
    _s();
    const [confirming, setConfirming] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    async function remove() {
        if (busy) return;
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch("/api/orders/".concat(orderId), {
                method: "DELETE"
            });
            if (response.ok) {
                if (returnToOrders) router.push("/orders");
                else router.refresh();
                return;
            }
            const result = await response.json().catch(()=>null);
            setMessage((result === null || result === void 0 ? void 0 : result.error) || "删除失败（HTTP ".concat(response.status, "），请稍后重试。"));
        } catch (e) {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                type: "button",
                variant: "danger",
                size: size,
                className: className,
                onClick: ()=>setConfirming(true),
                children: "删除 SO"
            }, void 0, false, {
                fileName: "[project]/src/components/delete-order-button.tsx",
                lineNumber: 7,
                columnNumber: 858
            }, this),
            confirming && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$delete$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeleteConfirmDialog"], {
                title: "确认删除此 SO？",
                message: message,
                busy: busy,
                onClose: ()=>setConfirming(false),
                onConfirm: remove,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "将删除该订单及其上传文件。若已有后续业务记录，系统会阻止删除。"
                }, void 0, false, {
                    fileName: "[project]/src/components/delete-order-button.tsx",
                    lineNumber: 7,
                    columnNumber: 1121
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/delete-order-button.tsx",
                lineNumber: 7,
                columnNumber: 996
            }, this)
        ]
    }, void 0, true);
}
_s(DeleteOrderButton, "+fjrARAyD3IRuIS6ZKTi5TMoOaE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DeleteOrderButton;
var _c;
__turbopack_context__.k.register(_c, "DeleteOrderButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/form-field.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "checkbox": "form-field-module__WhHEnW__checkbox",
  "control": "form-field-module__WhHEnW__control",
  "dateTime": "form-field-module__WhHEnW__dateTime",
  "error": "form-field-module__WhHEnW__error",
  "field": "form-field-module__WhHEnW__field",
  "select": "form-field-module__WhHEnW__select",
});
}),
"[project]/src/components/ui/form-field.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FormField",
    ()=>FormField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-field.module.css [app-client] (css module)");
;
;
function FormField(param) {
    let { label, children, hint, required, className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].field,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
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
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
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
_c = FormField;
var _c;
__turbopack_context__.k.register(_c, "FormField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/list.module.css [app-client] (css module)", ((__turbopack_context__) => {

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
  "selectEmpty": "list-module__hpCqyG__selectEmpty",
  "selectOption": "list-module__hpCqyG__selectOption",
  "selectOptionCompact": "list-module__hpCqyG__selectOptionCompact",
  "selectOptions": "list-module__hpCqyG__selectOptions",
  "selectSearch": "list-module__hpCqyG__selectSearch",
  "selectTrigger": "list-module__hpCqyG__selectTrigger",
  "selectTriggerCompact": "list-module__hpCqyG__selectTriggerCompact",
  "summary": "list-module__hpCqyG__summary",
});
}),
"[project]/src/components/ui/filter-select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FilterSelect",
    ()=>FilterSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pinyin$2d$pro$2f$dist$2f$esm$2f$core$2f$pinyin$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pinyin-pro/dist/esm/core/pinyin/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/list.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function optionsFrom(children) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Children"].toArray(children).flatMap((child)=>{
        if (!/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(child)) return [];
        return [
            {
                value: child.props.value || "",
                label: child.props.children,
                disabled: child.props.disabled
            }
        ];
    });
}
function optionText(label) {
    return typeof label === "string" || typeof label === "number" ? String(label) : "";
}
function optionSearchTerms(label) {
    const text = optionText(label);
    const syllables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pinyin$2d$pro$2f$dist$2f$esm$2f$core$2f$pinyin$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pinyin"])(text, {
        toneType: "none",
        type: "array"
    });
    return [
        text.toLocaleLowerCase(),
        syllables.join("").toLocaleLowerCase(),
        syllables.map((item)=>item[0] || "").join("").toLocaleLowerCase()
    ];
}
function FilterSelect(param) {
    let { children, className, triggerClassName, optionsClassName, optionClassName, searchable = true, defaultValue, value: controlledValue, name, disabled, onChange, onBlur, required, autoFocus, "aria-label": ariaLabel, "aria-invalid": ariaInvalid } = param;
    var _options_;
    _s();
    const options = optionsFrom(children);
    var _ref, _ref1;
    const initialValue = String((_ref1 = (_ref = controlledValue !== null && controlledValue !== void 0 ? controlledValue : defaultValue) !== null && _ref !== void 0 ? _ref : (_options_ = options[0]) === null || _options_ === void 0 ? void 0 : _options_.value) !== null && _ref1 !== void 0 ? _ref1 : "");
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialValue);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const listId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const searchRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const selected = options.find((option)=>option.value === value) || options[0];
    const isControlled = controlledValue !== undefined;
    const visibleOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FilterSelect.useMemo[visibleOptions]": ()=>{
            const [empty, ...rest] = options;
            const candidates = (empty === null || empty === void 0 ? void 0 : empty.value) === "" ? rest : options;
            const ordered = candidates.every({
                "FilterSelect.useMemo[visibleOptions]": (option)=>/^\d/.test(optionText(option.label))
            }["FilterSelect.useMemo[visibleOptions]"]) ? candidates : [
                ...candidates
            ].sort({
                "FilterSelect.useMemo[visibleOptions]": (a, b)=>optionSearchTerms(a.label)[1].localeCompare(optionSearchTerms(b.label)[1])
            }["FilterSelect.useMemo[visibleOptions]"]);
            const needle = query.trim().toLocaleLowerCase();
            const matched = needle ? ordered.filter({
                "FilterSelect.useMemo[visibleOptions]": (option)=>optionSearchTerms(option.label).some({
                        "FilterSelect.useMemo[visibleOptions]": (term)=>term.includes(needle)
                    }["FilterSelect.useMemo[visibleOptions]"])
            }["FilterSelect.useMemo[visibleOptions]"]) : ordered;
            return (empty === null || empty === void 0 ? void 0 : empty.value) === "" ? [
                empty,
                ...matched
            ] : matched;
        }
    }["FilterSelect.useMemo[visibleOptions]"], [
        options,
        query
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FilterSelect.useEffect": ()=>{
            if (isControlled) setValue(String(controlledValue));
        }
    }["FilterSelect.useEffect"], [
        controlledValue,
        isControlled
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FilterSelect.useEffect": ()=>{
            if (!open) return;
            const closeWhenOutside = {
                "FilterSelect.useEffect.closeWhenOutside": (event)=>{
                    var _rootRef_current;
                    if (!((_rootRef_current = rootRef.current) === null || _rootRef_current === void 0 ? void 0 : _rootRef_current.contains(event.target))) setOpen(false);
                }
            }["FilterSelect.useEffect.closeWhenOutside"];
            document.addEventListener("pointerdown", closeWhenOutside);
            return ({
                "FilterSelect.useEffect": ()=>document.removeEventListener("pointerdown", closeWhenOutside)
            })["FilterSelect.useEffect"];
        }
    }["FilterSelect.useEffect"], [
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FilterSelect.useEffect": ()=>{
            if (open && searchable) requestAnimationFrame({
                "FilterSelect.useEffect": ()=>{
                    var _searchRef_current;
                    return (_searchRef_current = searchRef.current) === null || _searchRef_current === void 0 ? void 0 : _searchRef_current.focus();
                }
            }["FilterSelect.useEffect"]);
        }
    }["FilterSelect.useEffect"], [
        open,
        searchable
    ]);
    const choose = (nextValue)=>{
        if (!isControlled) setValue(nextValue);
        if (inputRef.current) inputRef.current.value = nextValue;
        setOpen(false);
        setQuery("");
        onChange === null || onChange === void 0 ? void 0 : onChange({
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].select,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: inputRef,
                type: "hidden",
                name: name,
                value: isControlled ? String(controlledValue !== null && controlledValue !== void 0 ? controlledValue : "") : value,
                required: required
            }, void 0, false, {
                fileName: "[project]/src/components/ui/filter-select.tsx",
                lineNumber: 80,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selectTrigger,
                    triggerClassName
                ].filter(Boolean).join(" "),
                disabled: disabled,
                autoFocus: autoFocus,
                "aria-label": ariaLabel,
                "aria-invalid": ariaInvalid,
                "aria-haspopup": "listbox",
                "aria-expanded": open,
                "aria-controls": listId,
                onClick: ()=>{
                    setOpen((current)=>!current);
                    setQuery("");
                },
                onBlur: (event)=>onBlur === null || onBlur === void 0 ? void 0 : onBlur(event),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: open && query ? query : selected === null || selected === void 0 ? void 0 : selected.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/filter-select.tsx",
                        lineNumber: 82,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selectChevron,
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/filter-select.tsx",
                        lineNumber: 82,
                        columnNumber: 61
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/filter-select.tsx",
                lineNumber: 81,
                columnNumber: 5
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: listId,
                className: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selectOptions,
                    optionsClassName
                ].filter(Boolean).join(" "),
                role: "listbox",
                "aria-label": ariaLabel,
                children: [
                    searchable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: searchRef,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selectSearch,
                        value: query,
                        onChange: (event)=>setQuery(event.target.value),
                        onKeyDown: (event)=>{
                            if (event.key === "Escape") setOpen(false);
                        },
                        "aria-label": "输入筛选"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/filter-select.tsx",
                        lineNumber: 85,
                        columnNumber: 22
                    }, this),
                    visibleOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            role: "option",
                            "aria-selected": option.value === value,
                            className: [
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selectOption,
                                optionClassName
                            ].filter(Boolean).join(" "),
                            disabled: option.disabled,
                            onMouseDown: (event)=>event.preventDefault(),
                            onClick: ()=>choose(option.value),
                            children: option.label
                        }, option.value, false, {
                            fileName: "[project]/src/components/ui/filter-select.tsx",
                            lineNumber: 86,
                            columnNumber: 37
                        }, this)),
                    !visibleOptions.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selectEmpty,
                        children: "未找到匹配项"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/filter-select.tsx",
                        lineNumber: 87,
                        columnNumber: 34
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/filter-select.tsx",
                lineNumber: 84,
                columnNumber: 14
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/filter-select.tsx",
        lineNumber: 79,
        columnNumber: 10
    }, this);
}
_s(FilterSelect, "NZ0pYD+4ZNdAeGmY/acbhqkxbGE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = FilterSelect;
var _c;
__turbopack_context__.k.register(_c, "FilterSelect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/date-time-field.module.css [app-client] (css module)", ((__turbopack_context__) => {

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
"[project]/src/components/ui/date-time-field.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DateTimeField",
    ()=>DateTimeField,
    "DateTimeInput",
    ()=>DateTimeInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/date-time-field.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
function splitValue(value) {
    const match = /^(\d{4}-\d{2}-\d{2})(?:T| )(\d{2}:\d{2})$/.exec(value);
    return {
        date: (match === null || match === void 0 ? void 0 : match[1]) || "",
        time: (match === null || match === void 0 ? void 0 : match[2]) || ""
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
    return validDate(date) && validTime(time) ? "".concat(date, "T").concat(time) : "";
}
function monthTitle(date) {
    return "".concat(date.getFullYear(), "年").concat(String(date.getMonth() + 1).padStart(2, "0"), "月");
}
function dayKey(date) {
    return "".concat(date.getFullYear(), "-").concat(String(date.getMonth() + 1).padStart(2, "0"), "-").concat(String(date.getDate()).padStart(2, "0"));
}
function formatDateInput(value) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return "".concat(digits.slice(0, 4), "-").concat(digits.slice(4));
    return "".concat(digits.slice(0, 4), "-").concat(digits.slice(4, 6), "-").concat(digits.slice(6));
}
function CalendarPopover(param) {
    let { anchor, value, onSelect, onClose } = param;
    _s();
    const selected = validDate(value) ? new Date("".concat(value, "T00:00:00")) : new Date();
    const [month, setMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "CalendarPopover.useState": ()=>new Date(selected.getFullYear(), selected.getMonth(), 1)
    }["CalendarPopover.useState"]);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        top: 8,
        left: 8
    });
    const popoverRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const today = dayKey(new Date());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarPopover.useEffect": ()=>{
            const place = {
                "CalendarPopover.useEffect.place": ()=>{
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
                }
            }["CalendarPopover.useEffect.place"];
            place();
            window.addEventListener("resize", place);
            window.addEventListener("scroll", place, true);
            return ({
                "CalendarPopover.useEffect": ()=>{
                    window.removeEventListener("resize", place);
                    window.removeEventListener("scroll", place, true);
                }
            })["CalendarPopover.useEffect"];
        }
    }["CalendarPopover.useEffect"], [
        anchor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarPopover.useEffect": ()=>{
            const closeOutside = {
                "CalendarPopover.useEffect.closeOutside": (event)=>{
                    var _popoverRef_current;
                    const target = event.target;
                    if (!((_popoverRef_current = popoverRef.current) === null || _popoverRef_current === void 0 ? void 0 : _popoverRef_current.contains(target)) && !anchor.contains(target)) onClose();
                }
            }["CalendarPopover.useEffect.closeOutside"];
            const closeEscape = {
                "CalendarPopover.useEffect.closeEscape": (event)=>{
                    if (event.key === "Escape") onClose();
                }
            }["CalendarPopover.useEffect.closeEscape"];
            document.addEventListener("pointerdown", closeOutside);
            document.addEventListener("keydown", closeEscape);
            return ({
                "CalendarPopover.useEffect": ()=>{
                    document.removeEventListener("pointerdown", closeOutside);
                    document.removeEventListener("keydown", closeEscape);
                }
            })["CalendarPopover.useEffect"];
        }
    }["CalendarPopover.useEffect"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: popoverRef,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].popover,
        style: position,
        role: "dialog",
        "aria-label": "选择日期",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].calendarHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].calendarMonth,
                        children: monthTitle(month)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].calendarNav,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-label": "上个月",
                                onClick: ()=>setMonth((current)=>new Date(current.getFullYear(), current.getMonth() - 1, 1)),
                                children: "‹"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/date-time-field.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].weekdays,
                children: [
                    "日",
                    "一",
                    "二",
                    "三",
                    "四",
                    "五",
                    "六"
                ].map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].days,
                children: days.map((date)=>{
                    const key = dayKey(date);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].day,
                            date.getMonth() !== month.getMonth() ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].outside : undefined,
                            key === value ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selected : undefined,
                            key === today ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].today : undefined
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].calendarFooter,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(CalendarPopover, "X0eBPnnlEvnIq9FzY6agIV7Ys1o=");
_c = CalendarPopover;
function TimePopover(param) {
    let { anchor, value, onSelect, onClose } = param;
    _s1();
    const initial = validTime(value) ? value : "00:00";
    const [hour, setHour] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial.slice(0, 2));
    const [minute, setMinute] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial.slice(3, 5));
    const popoverRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        top: 8,
        left: 8
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimePopover.useEffect": ()=>{
            const place = {
                "TimePopover.useEffect.place": ()=>{
                    const rect = anchor.getBoundingClientRect();
                    const width = 158;
                    const height = 102;
                    const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
                    const below = rect.bottom + 6;
                    setPosition({
                        left,
                        top: below + height <= window.innerHeight ? below : Math.max(8, rect.top - height - 6)
                    });
                }
            }["TimePopover.useEffect.place"];
            place();
            window.addEventListener("resize", place);
            window.addEventListener("scroll", place, true);
            return ({
                "TimePopover.useEffect": ()=>{
                    window.removeEventListener("resize", place);
                    window.removeEventListener("scroll", place, true);
                }
            })["TimePopover.useEffect"];
        }
    }["TimePopover.useEffect"], [
        anchor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimePopover.useEffect": ()=>{
            const closeOutside = {
                "TimePopover.useEffect.closeOutside": (event)=>{
                    var _popoverRef_current;
                    const target = event.target;
                    if (!((_popoverRef_current = popoverRef.current) === null || _popoverRef_current === void 0 ? void 0 : _popoverRef_current.contains(target)) && !anchor.contains(target)) onClose();
                }
            }["TimePopover.useEffect.closeOutside"];
            const closeEscape = {
                "TimePopover.useEffect.closeEscape": (event)=>{
                    if (event.key === "Escape") onClose();
                }
            }["TimePopover.useEffect.closeEscape"];
            document.addEventListener("pointerdown", closeOutside);
            document.addEventListener("keydown", closeEscape);
            return ({
                "TimePopover.useEffect": ()=>{
                    document.removeEventListener("pointerdown", closeOutside);
                    document.removeEventListener("keydown", closeEscape);
                }
            })["TimePopover.useEffect"];
        }
    }["TimePopover.useEffect"], [
        anchor,
        onClose
    ]);
    const confirm = ()=>{
        const next = "".concat(hour.padStart(2, "0"), ":").concat(minute.padStart(2, "0"));
        if (!validTime(next)) return;
        onSelect(next);
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: popoverRef,
        className: "".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].popover, " ").concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].timePopover),
        style: position,
        role: "dialog",
        "aria-label": "选择时间",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                children: "选择时间（24 小时制）"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].timeFields,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: ":"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].timeActions,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onClose,
                        children: "取消"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/date-time-field.tsx",
                        lineNumber: 161,
                        columnNumber: 43
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s1(TimePopover, "kj3AyV0r/iq2SfaTfvRNn/yz0zU=");
_c1 = TimePopover;
const DateTimeInput = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_s2(function DateTimeInput(param, ref) {
    let { value, onValueChange, onCommit, className, disabled, required, name, onBlur, onFocus, ...props } = param;
    _s2();
    const { date: valueDate, time: valueTime } = splitValue(value);
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(valueDate);
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(valueTime);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [timeOpen, setTimeOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const calendarButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timeButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dateInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const currentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        date: valueDate,
        time: valueTime
    });
    const inputId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DateTimeInput.DateTimeInput.useEffect": ()=>{
            setDate(valueDate);
            setTime(valueTime);
            currentRef.current = {
                date: valueDate,
                time: valueTime
            };
        }
    }["DateTimeInput.DateTimeInput.useEffect"], [
        valueDate,
        valueTime
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DateTimeInput.DateTimeInput.useEffect": ()=>{
            var _dateInputRef_current;
            (_dateInputRef_current = dateInputRef.current) === null || _dateInputRef_current === void 0 ? void 0 : _dateInputRef_current.setCustomValidity(required && !validTime(time) ? "请选择时间。" : "");
        }
    }["DateTimeInput.DateTimeInput.useEffect"], [
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
    const commit = function() {
        let nextDate = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : currentRef.current.date, nextTime = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : currentRef.current.time;
        return onCommit === null || onCommit === void 0 ? void 0 : onCommit(combine(nextDate, nextTime));
    };
    const handleBlur = (event)=>{
        onBlur === null || onBlur === void 0 ? void 0 : onBlur(event);
        window.setTimeout(()=>{
            var _rootRef_current;
            if (!((_rootRef_current = rootRef.current) === null || _rootRef_current === void 0 ? void 0 : _rootRef_current.contains(document.activeElement))) commit();
        }, 0);
    };
    const invalid = Boolean((date || time) && (!validDate(date) || !validTime(time)));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].root,
            invalid ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].invalid : undefined,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].editor,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dateZone,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: (node)=>{
                                    dateInputRef.current = node;
                                    if (typeof ref === "function") ref(node);
                                    else if (ref) ref.current = node;
                                },
                                id: inputId,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dateInput,
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                ref: calendarButtonRef,
                                type: "button",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].calendarButton,
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        ref: timeButtonRef,
                        type: "button",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].timeSelector,
                        disabled: disabled,
                        "aria-label": "选择时间",
                        "aria-expanded": timeOpen,
                        onClick: ()=>setTimeOpen((current)=>!current),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: time || "HH:mm"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/date-time-field.tsx",
                                lineNumber: 201,
                                columnNumber: 193
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "hidden",
                name: name,
                value: combine(date, time)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/date-time-field.tsx",
                lineNumber: 203,
                columnNumber: 5
            }, this),
            open && calendarButtonRef.current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CalendarPopover, {
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
            timeOpen && timeButtonRef.current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TimePopover, {
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
}, "gz89jFCEDpcpUWrUOOU8aopatGk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
}));
_c2 = DateTimeInput;
function DateTimeField(param) {
    let { type: _type, defaultValue, value, onChange, ...props } = param;
    _s3();
    var _ref;
    const [internalValue, setInternalValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(String((_ref = value !== null && value !== void 0 ? value : defaultValue) !== null && _ref !== void 0 ? _ref : ""));
    const controlled = value !== undefined;
    const currentValue = controlled ? String(value !== null && value !== void 0 ? value : "") : internalValue;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DateTimeInput, {
        ...props,
        value: currentValue,
        onValueChange: (nextValue)=>{
            if (!controlled) setInternalValue(nextValue);
            onChange === null || onChange === void 0 ? void 0 : onChange({
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
_s3(DateTimeField, "F/phft9TKUfKrJJIkUOkHAyBWWo=");
_c3 = DateTimeField;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "CalendarPopover");
__turbopack_context__.k.register(_c1, "TimePopover");
__turbopack_context__.k.register(_c2, "DateTimeInput");
__turbopack_context__.k.register(_c3, "DateTimeField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/form-controls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-field.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-field.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/filter-select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/date-time-field.tsx [app-client] (ecmascript)");
;
;
;
;
;
function TextField(param) {
    let { label, hint, error, className, required, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
        label: label,
        hint: hint,
        required: required,
        className: className,
        children: [
            props.type === "datetime-local" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$date$2d$time$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DateTimeField"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dateTime,
                required: required,
                "aria-invalid": Boolean(error) || undefined,
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 27,
                columnNumber: 124
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].control,
                required: required,
                "aria-invalid": Boolean(error) || undefined,
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 27,
                columnNumber: 246
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error,
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
_c = TextField;
function SelectField(param) {
    let { label, hint, error, className, required, children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
        label: label,
        hint: hint,
        required: required,
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterSelect"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].select,
                triggerClassName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].control,
                required: required,
                "aria-invalid": Boolean(error) || undefined,
                ...props,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 32,
                columnNumber: 89
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error,
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
_c1 = SelectField;
function TextareaField(param) {
    let { label, hint, error, className, required, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
        label: label,
        hint: hint,
        required: required,
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].control,
                required: required,
                "aria-invalid": Boolean(error) || undefined,
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 37,
                columnNumber: 89
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error,
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
_c2 = TextareaField;
function CheckboxField(param) {
    let { children, hint, className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].checkbox,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "checkbox",
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 48,
                columnNumber: 84
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 48,
                columnNumber: 120
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
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
_c3 = CheckboxField;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "TextField");
__turbopack_context__.k.register(_c1, "SelectField");
__turbopack_context__.k.register(_c2, "TextareaField");
__turbopack_context__.k.register(_c3, "CheckboxField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/compact-select.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "critical": "compact-select-module__kNz1Ga__critical",
  "options": "compact-select-module__kNz1Ga__options",
  "root": "compact-select-module__kNz1Ga__root",
  "select": "compact-select-module__kNz1Ga__select",
  "success": "compact-select-module__kNz1Ga__success",
  "warning": "compact-select-module__kNz1Ga__warning",
});
}),
"[project]/src/components/ui/compact-select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompactSelect",
    ()=>CompactSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/compact-select.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/filter-select.tsx [app-client] (ecmascript)");
;
;
;
/** Small status-like select for dense list rows and summary cards. */ const toneClass = {
    PARSED: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].warning,
    PENDING: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].warning,
    PENDING_REVIEW: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].warning,
    WAITING: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].warning,
    VERIFIED: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].success,
    CONFIRMED: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].success,
    COMPLETED: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].success,
    ACTIVE: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].success,
    CANCELLED: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].critical,
    INACTIVE: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].critical
};
function CompactSelect(param) {
    let { children, className, value, defaultValue, ...props } = param;
    var _ref;
    const currentValue = String((_ref = value !== null && value !== void 0 ? value : defaultValue) !== null && _ref !== void 0 ? _ref : "");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterSelect"], {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].root,
        triggerClassName: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].select,
            toneClass[currentValue],
            className
        ].filter(Boolean).join(" "),
        optionsClassName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].options,
        searchable: false,
        value: value,
        defaultValue: defaultValue,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/compact-select.tsx",
        lineNumber: 21,
        columnNumber: 10
    }, this);
}
_c = CompactSelect;
var _c;
__turbopack_context__.k.register(_c, "CompactSelect");
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
"[project]/src/lib/business.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "allowedOrderStatusTransitions",
    ()=>allowedOrderStatusTransitions,
    "duplicateFingerprint",
    ()=>duplicateFingerprint,
    "nextInternalContainerCode",
    ()=>nextInternalContainerCode,
    "orderStatuses",
    ()=>orderStatuses,
    "validateOrderStatusTransition",
    ()=>validateOrderStatusTransition,
    "validatePlanAssignment",
    ()=>validatePlanAssignment
]);
function duplicateFingerprint(input) {
    return "".concat(input.customerId, ":").concat(input.carrier.trim().toUpperCase(), ":").concat(input.soNumber.trim().toUpperCase(), ":").concat(input.sha256);
}
function validatePlanAssignment(activePlanIds) {
    if (activePlanIds.length > 0) throw new Error("该内部柜子已在生效中的装柜计划内");
}
function nextInternalContainerCode(orderId, index) {
    return "IC-".concat(orderId.slice(-6).toUpperCase(), "-").concat(String(index).padStart(3, "0"));
}
const orderStatuses = [
    "PENDING_REVIEW",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED"
];
const allowedOrderTransitions = {
    PENDING_REVIEW: [
        "CONFIRMED",
        "CANCELLED"
    ],
    CONFIRMED: [
        "PENDING_REVIEW",
        "IN_PROGRESS",
        "CANCELLED"
    ],
    IN_PROGRESS: [
        "COMPLETED",
        "CANCELLED"
    ],
    COMPLETED: [
        "CANCELLED"
    ],
    CANCELLED: []
};
function allowedOrderStatusTransitions(status) {
    return [
        status,
        ...allowedOrderTransitions[status]
    ];
}
function validateOrderStatusTransition(from, to) {
    if (from === to) return;
    if (!allowedOrderTransitions[from].includes(to)) throw new Error("订单状态不能从 ".concat(from, " 变更为 ").concat(to));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/order-status-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OrderStatusForm",
    ()=>OrderStatusForm,
    "OrderStatusTag",
    ()=>OrderStatusTag,
    "ParseStatusTag",
    ()=>ParseStatusTag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/business.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/user-feedback.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-controls.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/compact-select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/feedback-message.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$business$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/business.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
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
const labels = {
    PENDING_REVIEW: "待处理",
    CONFIRMED: "已确认",
    IN_PROGRESS: "执行中",
    COMPLETED: "已完成",
    CANCELLED: "已取消"
};
const hints = {
    PENDING_REVIEW: "客户或柜量尚待处理；可从“已确认”退回至此状态。",
    CONFIRMED: "客户及柜量已确认，可安排后续计划。",
    IN_PROGRESS: "订单正在执行中。",
    COMPLETED: "该订单的业务流程已完成。",
    CANCELLED: "订单已取消，不再继续安排。"
};
function OrderStatusForm(param) {
    let { orderId, status } = param;
    _s();
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(status);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    async function submit() {
        if (busy || value === status) return;
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch("/api/orders/".concat(orderId, "/status"), {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    status: value
                })
            });
            if (response.ok) {
                setMessage("订单状态已更新。");
                router.refresh();
            } else setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userFeedback"].retry("更新订单状态"));
        } catch (e) {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["order-status-section"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "订单业务状态"
            }, void 0, false, {
                fileName: "[project]/src/components/order-status-form.tsx",
                lineNumber: 30,
                columnNumber: 70
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["muted"],
                children: "仅在订单实际进入下一阶段时更新状态。"
            }, void 0, false, {
                fileName: "[project]/src/components/order-status-form.tsx",
                lineNumber: 30,
                columnNumber: 85
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["order-status-section__controls"],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectField"], {
                        label: "当前或新的状态",
                        value: value,
                        disabled: busy,
                        onChange: (event)=>setValue(event.target.value),
                        children: Object.entries(labels).map((param)=>{
                            let [key, label] = param;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: key,
                                children: label
                            }, key, false, {
                                fileName: "[project]/src/components/order-status-form.tsx",
                                lineNumber: 30,
                                columnNumber: 366
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/order-status-form.tsx",
                        lineNumber: 30,
                        columnNumber: 212
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        wide: "mobile",
                        onClick: submit,
                        disabled: busy || value === status,
                        children: busy ? "正在更新…" : "保存状态"
                    }, void 0, false, {
                        fileName: "[project]/src/components/order-status-form.tsx",
                        lineNumber: 30,
                        columnNumber: 428
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/order-status-form.tsx",
                lineNumber: 30,
                columnNumber: 146
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["order-status-section__hint"],
                children: hints[value] || ""
            }, void 0, false, {
                fileName: "[project]/src/components/order-status-form.tsx",
                lineNumber: 30,
                columnNumber: 557
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/order-status-form.tsx",
                lineNumber: 30,
                columnNumber: 653
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/order-status-form.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_s(OrderStatusForm, "uq5oK5yeIbdnAzSuP8b9QqvBvb0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = OrderStatusForm;
const tagLabels = {
    PENDING_REVIEW: "待处理",
    CONFIRMED: "已确认",
    IN_PROGRESS: "执行中",
    COMPLETED: "已完成",
    CANCELLED: "已取消"
};
const parseStatusLabels = {
    PARSED: "已解析",
    VERIFIED: "已核对"
};
function OrderStatusTag(param) {
    let { orderId, status } = param;
    _s1();
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(status);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const availableStatuses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$business$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allowedOrderStatusTransitions"])(value);
    async function change(next) {
        if (busy || next === value) return;
        const previous = value;
        setValue(next);
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch("/api/orders/".concat(orderId, "/status"), {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    status: next
                })
            });
            if (response.ok) router.refresh();
            else {
                setValue(previous);
                setMessage("状态未更新");
            }
        } catch (e) {
            setValue(previous);
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["order-status-tag"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CompactSelect"], {
                "aria-label": "修改订单业务状态",
                value: value,
                disabled: busy || availableStatuses.length === 1,
                onChange: (event)=>change(event.target.value),
                children: availableStatuses.map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: key,
                        children: tagLabels[key]
                    }, key, false, {
                        fileName: "[project]/src/components/order-status-form.tsx",
                        lineNumber: 51,
                        columnNumber: 241
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/order-status-form.tsx",
                lineNumber: 51,
                columnNumber: 63
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                tone: "error",
                as: "small",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/order-status-form.tsx",
                lineNumber: 51,
                columnNumber: 326
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/order-status-form.tsx",
        lineNumber: 51,
        columnNumber: 10
    }, this);
}
_s1(OrderStatusTag, "uq5oK5yeIbdnAzSuP8b9QqvBvb0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = OrderStatusTag;
function ParseStatusTag(param) {
    let { orderId, status } = param;
    _s2();
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(status);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    async function change(next) {
        if (busy || next === value) return;
        const previous = value;
        setValue(next);
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch("/api/orders/".concat(orderId, "/parse-status"), {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    status: next
                })
            });
            if (response.ok) router.refresh();
            else {
                setValue(previous);
                setMessage("状态未更新");
            }
        } catch (e) {
            setValue(previous);
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["order-status-tag"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$compact$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CompactSelect"], {
                "aria-label": "修改解析状态",
                value: value,
                disabled: busy,
                onChange: (event)=>change(event.target.value),
                children: Object.entries(parseStatusLabels).map((param)=>{
                    let [key, label] = param;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: key,
                        children: label
                    }, key, false, {
                        fileName: "[project]/src/components/order-status-form.tsx",
                        lineNumber: 68,
                        columnNumber: 257
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/order-status-form.tsx",
                lineNumber: 68,
                columnNumber: 63
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                tone: "error",
                as: "small",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/order-status-form.tsx",
                lineNumber: 68,
                columnNumber: 333
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/order-status-form.tsx",
        lineNumber: 68,
        columnNumber: 10
    }, this);
}
_s2(ParseStatusTag, "uq5oK5yeIbdnAzSuP8b9QqvBvb0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c2 = ParseStatusTag;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "OrderStatusForm");
__turbopack_context__.k.register(_c1, "OrderStatusTag");
__turbopack_context__.k.register(_c2, "ParseStatusTag");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/parse-pending-button.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "parse-pending-button-module__EAn4ba__actions",
  "compact": "parse-pending-button-module__EAn4ba__compact",
});
}),
"[project]/src/components/parse-pending-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ParsePendingButton",
    ()=>ParsePendingButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/feedback-message.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$parse$2d$pending$2d$button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/parse-pending-button.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function ParsePendingButton(param) {
    let { orderId, compact = false, variant = "secondary", size = "default", onStatusChange, onProgressChange, fileIds, requireFiles = false, reloadOnComplete = true, reparse = false, className } = param;
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    async function run() {
        setState("running");
        const runningMessage = "正在识别订单信息…";
        setMessage(runningMessage);
        onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange({
            state: "running",
            message: runningMessage
        });
        const selectedFileIds = (fileIds === null || fileIds === void 0 ? void 0 : fileIds.filter(Boolean)) || [];
        const refreshProgress = async ()=>{
            if (!selectedFileIds.length) return;
            const response = await fetch("/api/orders/parse/progress?fileIds=".concat(encodeURIComponent(selectedFileIds.join(","))));
            const progress = await response.json().catch(()=>null);
            if (response.ok && progress) onProgressChange === null || onProgressChange === void 0 ? void 0 : onProgressChange({
                completed: progress.completed || 0,
                total: progress.total || selectedFileIds.length,
                files: progress.files
            });
        };
        let progressTimer;
        try {
            await refreshProgress();
            progressTimer = selectedFileIds.length ? window.setInterval(()=>{
                void refreshProgress();
            }, 500) : undefined;
            const response = await fetch("/api/orders/parse", {
                method: "POST",
                headers: orderId || selectedFileIds.length ? {
                    "content-type": "application/json"
                } : undefined,
                body: orderId || selectedFileIds.length ? JSON.stringify({
                    orderId,
                    fileIds: selectedFileIds,
                    reparse
                }) : undefined
            });
            const result = await response.json().catch(()=>({}));
            if (!response.ok) throw new Error((result === null || result === void 0 ? void 0 : result.error) || "订单信息暂未识别完成，请稍后重试。");
            await refreshProgress();
            const nextState = result.failedCount ? "error" : "success";
            const nextMessage = result.failedCount ? "已识别 ".concat(result.processedCount || 0, " 份 SO；另有 ").concat(result.failedCount, " 份未完成，请在订单列表中打开后查看。") : result.processedCount ? "已识别 ".concat(result.processedCount, " 份 SO，订单列表已更新。") : "没有需要识别的 SO。 ";
            setState(nextState);
            setMessage(nextMessage);
            onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange({
                state: nextState,
                message: nextMessage
            });
            onProgressChange === null || onProgressChange === void 0 ? void 0 : onProgressChange({
                completed: selectedFileIds.length,
                total: selectedFileIds.length
            });
            if (reloadOnComplete) {
                // A route replacement restores the browser to the top of the list.
                // Refresh server data in place so a card action keeps its viewport.
                router.refresh();
            } else router.refresh();
        } catch (error) {
            const nextMessage = error instanceof Error ? error.message : "订单信息暂未识别完成，请稍后重试。";
            setState("error");
            setMessage(nextMessage);
            onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange({
                state: "error",
                message: nextMessage
            });
        } finally{
            if (progressTimer) window.clearInterval(progressTimer);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: compact ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$parse$2d$pending$2d$button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].compact : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$parse$2d$pending$2d$button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actions,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: variant,
                size: size,
                className: className,
                onClick: run,
                disabled: state === "running" || requireFiles && !(fileIds === null || fileIds === void 0 ? void 0 : fileIds.length),
                title: requireFiles && !(fileIds === null || fileIds === void 0 ? void 0 : fileIds.length) ? "请先上传至少一个 SO 文件" : undefined,
                children: state === "running" ? "识别中…" : orderId ? reparse ? "重新解析" : "识别此 SO" : "识别 SO 信息"
            }, void 0, false, {
                fileName: "[project]/src/components/parse-pending-button.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            message && !onStatusChange && (!compact || state === "error") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                as: "span",
                tone: state === "error" ? "error" : state === "success" ? "success" : "info",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/parse-pending-button.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/parse-pending-button.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
_s(ParsePendingButton, "pW1UJj/gbe1V2QZQeloVtfwhG3M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ParsePendingButton;
var _c;
__turbopack_context__.k.register(_c, "ParsePendingButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/status-labels.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/list.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FilterActionLink",
    ()=>FilterActionLink,
    "FilterActions",
    ()=>FilterActions,
    "FilterClearLink",
    ()=>FilterClearLink,
    "FilterField",
    ()=>FilterField,
    "FilterSelectField",
    ()=>FilterSelectField,
    "FilterTextField",
    ()=>FilterTextField,
    "ListFilter",
    ()=>ListFilter,
    "Pagination",
    ()=>Pagination,
    "ResultSummary",
    ()=>ResultSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/list.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/filter-select.tsx [app-client] (ecmascript)");
;
;
;
;
;
const ListFilter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = function ListFilter(param, ref) {
    let { className, children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        ref: ref,
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].filter,
            className
        ].filter(Boolean).join(" "),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
});
_c1 = ListFilter;
function FilterField(param) {
    let { label, children, className, search = false } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].field,
            search ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].search : undefined,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/ui/list.tsx",
                lineNumber: 14,
                columnNumber: 117
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 14,
        columnNumber: 10
    }, this);
}
_c2 = FilterField;
function FilterTextField(param) {
    let { className, compact = false, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].control,
            compact ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].controlCompact : undefined,
            className
        ].filter(Boolean).join(" "),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, this);
}
_c3 = FilterTextField;
function FilterSelectField(param) {
    let { children, className, compact = false, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterSelect"], {
        className: className,
        triggerClassName: compact ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selectTriggerCompact : undefined,
        optionClassName: compact ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].selectOptionCompact : undefined,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c4 = FilterSelectField;
function FilterActions(param) {
    let { className, children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actions,
            className
        ].filter(Boolean).join(" "),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 28,
        columnNumber: 10
    }, this);
}
_c5 = FilterActions;
function FilterClearLink(param) {
    let { href, children = "清除筛选", className, size } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ButtonLink"], {
        variant: "secondary",
        size: size,
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].clear,
            className
        ].filter(Boolean).join(" "),
        href: href,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 32,
        columnNumber: 10
    }, this);
}
_c6 = FilterClearLink;
function FilterActionLink(param) {
    let { href, children, className, size } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ButtonLink"], {
        size: size,
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].clear,
            className
        ].filter(Boolean).join(" "),
        href: href,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 36,
        columnNumber: 10
    }, this);
}
_c7 = FilterActionLink;
function ResultSummary(param) {
    let { className, children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].summary,
            className
        ].filter(Boolean).join(" "),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 40,
        columnNumber: 10
    }, this);
}
_c8 = ResultSummary;
function Pagination(param) {
    let { currentPage, totalPages, href, label } = param;
    if (totalPages <= 1) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].pagination,
        "aria-label": label,
        children: [
            currentPage > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: href(currentPage - 1),
                children: "上一页"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/list.tsx",
                lineNumber: 47,
                columnNumber: 84
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    "第 ",
                    currentPage,
                    " / ",
                    totalPages,
                    " 页"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/list.tsx",
                lineNumber: 47,
                columnNumber: 124
            }, this),
            currentPage < totalPages && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: href(currentPage + 1),
                children: "下一页"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/list.tsx",
                lineNumber: 47,
                columnNumber: 198
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 47,
        columnNumber: 10
    }, this);
}
_c9 = Pagination;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "ListFilter$forwardRef");
__turbopack_context__.k.register(_c1, "ListFilter");
__turbopack_context__.k.register(_c2, "FilterField");
__turbopack_context__.k.register(_c3, "FilterTextField");
__turbopack_context__.k.register(_c4, "FilterSelectField");
__turbopack_context__.k.register(_c5, "FilterActions");
__turbopack_context__.k.register(_c6, "FilterClearLink");
__turbopack_context__.k.register(_c7, "FilterActionLink");
__turbopack_context__.k.register(_c8, "ResultSummary");
__turbopack_context__.k.register(_c9, "Pagination");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/orders-filter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OrdersFilter",
    ()=>OrdersFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/business.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/status-labels.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/list.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
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
    "PARSED",
    "VERIFIED"
];
function OrdersFilter(param) {
    let { q, status, parseStatus, customerId, customers, reviewOnly = false, exportHref, className } = param;
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const formRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const apply = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OrdersFilter.useCallback[apply]": ()=>{
            const form = formRef.current;
            if (!form) return;
            const params = new URLSearchParams();
            for (const [key, raw] of new FormData(form).entries()){
                const value = String(raw).trim();
                if (value) params.set(key, value);
            }
            const search = params.toString();
            router.replace(search ? "".concat(pathname, "?").concat(search) : pathname, {
                scroll: false
            });
        }
    }["OrdersFilter.useCallback[apply]"], [
        pathname,
        router
    ]);
    const scheduleSearch = ()=>{
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(apply, 220);
    };
    const clearHref = reviewOnly ? "/orders?review=1" : "/orders";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListFilter"], {
        ref: formRef,
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["orders-filter"],
            className
        ].filter(Boolean).join(" "),
        onSubmit: (event)=>event.preventDefault(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterField"], {
                label: "搜索",
                search: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterTextField"], {
                    compact: true,
                    name: "q",
                    defaultValue: q,
                    placeholder: "SO、船公司、船名或航次",
                    onChange: scheduleSearch
                }, void 0, false, {
                    fileName: "[project]/src/components/orders-filter.tsx",
                    lineNumber: 37,
                    columnNumber: 36
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/orders-filter.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterField"], {
                label: "业务状态",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterSelectField"], {
                    compact: true,
                    name: "status",
                    defaultValue: status || "",
                    onChange: apply,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "全部业务状态"
                        }, void 0, false, {
                            fileName: "[project]/src/components/orders-filter.tsx",
                            lineNumber: 38,
                            columnNumber: 117
                        }, this),
                        orderStatuses.map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: value,
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["statusLabel"])(value)
                            }, value, false, {
                                fileName: "[project]/src/components/orders-filter.tsx",
                                lineNumber: 38,
                                columnNumber: 177
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/orders-filter.tsx",
                    lineNumber: 38,
                    columnNumber: 31
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/orders-filter.tsx",
                lineNumber: 38,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterField"], {
                label: "解析状态",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterSelectField"], {
                    compact: true,
                    name: "parseStatus",
                    defaultValue: parseStatus || "",
                    onChange: apply,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "全部解析状态"
                        }, void 0, false, {
                            fileName: "[project]/src/components/orders-filter.tsx",
                            lineNumber: 39,
                            columnNumber: 127
                        }, this),
                        parseStatuses.map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: value,
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$status$2d$labels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["statusLabel"])(value)
                            }, value, false, {
                                fileName: "[project]/src/components/orders-filter.tsx",
                                lineNumber: 39,
                                columnNumber: 187
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/orders-filter.tsx",
                    lineNumber: 39,
                    columnNumber: 31
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/orders-filter.tsx",
                lineNumber: 39,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterField"], {
                label: "客户",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterSelectField"], {
                    compact: true,
                    name: "customerId",
                    defaultValue: customerId || "",
                    onChange: apply,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "全部客户"
                        }, void 0, false, {
                            fileName: "[project]/src/components/orders-filter.tsx",
                            lineNumber: 40,
                            columnNumber: 123
                        }, this),
                        customers.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: customer.id,
                                children: customer.name
                            }, customer.id, false, {
                                fileName: "[project]/src/components/orders-filter.tsx",
                                lineNumber: 40,
                                columnNumber: 180
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/orders-filter.tsx",
                    lineNumber: 40,
                    columnNumber: 29
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/orders-filter.tsx",
                lineNumber: 40,
                columnNumber: 5
            }, this),
            reviewOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterTextField"], {
                type: "hidden",
                name: "review",
                value: "1"
            }, void 0, false, {
                fileName: "[project]/src/components/orders-filter.tsx",
                lineNumber: 41,
                columnNumber: 20
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterActions"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["orders-filter__actions"],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterClearLink"], {
                        size: "toolbar",
                        href: clearHref
                    }, void 0, false, {
                        fileName: "[project]/src/components/orders-filter.tsx",
                        lineNumber: 42,
                        columnNumber: 73
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterActionLink"], {
                        size: "toolbar",
                        href: exportHref,
                        children: "导出 CSV"
                    }, void 0, false, {
                        fileName: "[project]/src/components/orders-filter.tsx",
                        lineNumber: 42,
                        columnNumber: 123
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/orders-filter.tsx",
                lineNumber: 42,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/orders-filter.tsx",
        lineNumber: 36,
        columnNumber: 10
    }, this);
}
_s(OrdersFilter, "vJqRPniI9mfq0LJfi6azPZZi5rQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = OrdersFilter;
var _c;
__turbopack_context__.k.register(_c, "OrdersFilter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/file-upload-trigger.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "busy": "file-upload-trigger-module__TQjcwG__busy",
  "trigger": "file-upload-trigger-module__TQjcwG__trigger",
});
}),
"[project]/src/components/ui/file-upload-trigger.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileUploadTrigger",
    ()=>FileUploadTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/action-button.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$file$2d$upload$2d$trigger$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/file-upload-trigger.module.css [app-client] (css module)");
;
;
;
function FileUploadTrigger(param) {
    let { children, className, busy = false, onChange, disabled, variant = "primary", size = "default", ...props } = param;
    const unavailable = busy || Boolean(disabled);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].button,
            variant === "secondary" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].secondary : undefined,
            size === "toolbar" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].toolbar : undefined,
            size === "small" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$action$2d$button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].small : undefined,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$file$2d$upload$2d$trigger$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].trigger,
            busy ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$file$2d$upload$2d$trigger$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].busy : undefined,
            className
        ].filter(Boolean).join(" "),
        "aria-disabled": unavailable || undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "file",
                disabled: unavailable,
                onChange: onChange,
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/file-upload-trigger.tsx",
                lineNumber: 8,
                columnNumber: 345
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/file-upload-trigger.tsx",
                lineNumber: 8,
                columnNumber: 470
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/file-upload-trigger.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
_c = FileUploadTrigger;
var _c;
__turbopack_context__.k.register(_c, "FileUploadTrigger");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/so-upload-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SoUploadForm",
    ()=>SoUploadForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/business.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$parse$2d$pending$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/parse-pending-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/user-feedback.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$delete$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/delete-confirm-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$file$2d$upload$2d$trigger$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/file-upload-trigger.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const parseLabel = {
    PENDING: "待识别",
    PROCESSING: "识别中",
    PARSED: "识别完成",
    FAILED: "识别失败",
    VERIFIED: "已核对"
};
function SoUploadForm(param) {
    let { className } = param;
    _s();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fileName, setFileName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [batchFiles, setBatchFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [removingId, setRemovingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [confirmingRemoval, setConfirmingRemoval] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [parseStatus, setParseStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [parseProgress, setParseProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const successfulFiles = batchFiles.filter((file)=>file.upload === "success" && file.id);
    const uploadFailures = batchFiles.filter((file)=>file.upload === "error");
    const parseFailures = successfulFiles.filter((file)=>file.parseStatus === "FAILED");
    const recognizableFiles = successfulFiles.filter((file)=>file.parseStatus === "PENDING" || file.parseStatus === "FAILED");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SoUploadForm.useEffect": ()=>{
            if (!message) return;
            const timeout = window.setTimeout({
                "SoUploadForm.useEffect.timeout": ()=>setMessage("")
            }["SoUploadForm.useEffect.timeout"], 3500);
            return ({
                "SoUploadForm.useEffect": ()=>window.clearTimeout(timeout)
            })["SoUploadForm.useEffect"];
        }
    }["SoUploadForm.useEffect"], [
        message
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SoUploadForm.useEffect": ()=>{
            if (!batchFiles.length) setExpanded(false);
        }
    }["SoUploadForm.useEffect"], [
        batchFiles.length
    ]);
    const patchFile = (key, patch)=>setBatchFiles((current)=>current.map((file)=>file.key === key ? {
                    ...file,
                    ...patch
                } : file));
    const dismissFailedUpload = (key)=>setBatchFiles((current)=>current.filter((file)=>file.key !== key));
    async function upload(files, retryKey) {
        if (busy) return;
        setBusy(true);
        setMessage("");
        setParseStatus(null);
        setParseProgress(null);
        const entries = retryKey ? batchFiles.filter((file)=>file.key === retryKey) : files.map((file, index)=>({
                key: "".concat(Date.now(), "-").concat(index, "-").concat(file.name),
                name: file.name,
                source: file,
                upload: "uploading"
            }));
        if (retryKey) patchFile(retryKey, {
            upload: "uploading",
            error: undefined
        });
        else setBatchFiles((current)=>[
                ...current,
                ...entries
            ]);
        try {
            for (const entry of entries){
                setFileName(entry.name);
                const data = new FormData();
                data.set("file", entry.source);
                try {
                    const response = await fetch("/api/orders/upload", {
                        method: "POST",
                        body: data
                    });
                    const result = await response.json().catch(()=>null);
                    if (!response.ok) {
                        patchFile(entry.key, {
                            upload: "error",
                            error: (result === null || result === void 0 ? void 0 : result.error) || "上传请求失败（HTTP ".concat(response.status, "）")
                        });
                        continue;
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.id)) throw new Error("上传服务返回的数据不完整，请稍后重试。");
                    setBatchFiles((current)=>{
                        const duplicate = current.some((file)=>file.key !== entry.key && file.id === result.id);
                        if (duplicate) return current.filter((file)=>file.key !== entry.key);
                        return current.map((file)=>file.key === entry.key ? {
                                ...file,
                                id: result.id,
                                upload: "success",
                                parseStatus: result.parseStatus || "PENDING",
                                error: undefined
                            } : file);
                    });
                } catch (error) {
                    patchFile(entry.key, {
                        upload: "error",
                        error: error instanceof Error ? error.message : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userFeedback"].network
                    });
                }
            }
        } finally{
            setFileName("");
            setBusy(false);
        }
    }
    async function removeUploaded() {
        if (!(confirmingRemoval === null || confirmingRemoval === void 0 ? void 0 : confirmingRemoval.id) || removingId) return;
        setRemovingId(confirmingRemoval.id);
        try {
            const response = await fetch("/api/orders/upload/".concat(confirmingRemoval.id), {
                method: "DELETE"
            });
            if (response.ok) {
                setMessage("“".concat(confirmingRemoval.name, "”已删除。"));
                setBatchFiles((current)=>current.filter((file)=>file.key !== confirmingRemoval.key));
                setConfirmingRemoval(null);
                router.refresh();
            } else {
                const result = await response.json().catch(()=>null);
                setMessage((result === null || result === void 0 ? void 0 : result.error) || "删除失败（HTTP ".concat(response.status, "）。"));
            }
        } catch (e) {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setRemovingId(null);
        }
    }
    function updateParseProgress(progress) {
        setParseProgress({
            completed: progress.completed,
            total: progress.total
        });
        if (!progress.files) return;
        const statusById = new Map(progress.files.map((file)=>[
                file.id,
                file.parseStatus
            ]));
        setBatchFiles((current)=>current.map((file)=>file.id && statusById.has(file.id) ? {
                    ...file,
                    parseStatus: statusById.get(file.id)
                } : file));
    }
    function handleParseStatus(status) {
        setParseStatus(status);
        if (status.state === "success") setExpanded(false);
    }
    async function retryRecognition(file) {
        if (!file.id) return;
        setParseStatus({
            state: "running",
            message: "正在识别订单信息…"
        });
        setParseProgress({
            completed: 0,
            total: 1
        });
        patchFile(file.key, {
            parseStatus: "PROCESSING"
        });
        try {
            const response = await fetch("/api/orders/parse", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    fileIds: [
                        file.id
                    ]
                })
            });
            const result = await response.json().catch(()=>null);
            if (!response.ok) throw new Error((result === null || result === void 0 ? void 0 : result.error) || "订单信息暂未识别完成，请稍后重试。");
            patchFile(file.key, {
                parseStatus: (result === null || result === void 0 ? void 0 : result.failedCount) ? "FAILED" : "PARSED"
            });
            setParseStatus((result === null || result === void 0 ? void 0 : result.failedCount) ? {
                state: "error",
                message: "识别失败，请重试或检查文件内容。"
            } : {
                state: "success",
                message: "订单信息识别完成。"
            });
            setParseProgress({
                completed: 1,
                total: 1
            });
            router.refresh();
        } catch (error) {
            patchFile(file.key, {
                parseStatus: "FAILED"
            });
            setParseStatus({
                state: "error",
                message: error instanceof Error ? error.message : "订单信息暂未识别完成，请稍后重试。"
            });
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload"],
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "导入 SO"
            }, void 0, false, {
                fileName: "[project]/src/components/so-upload-form.tsx",
                lineNumber: 92,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__actions"],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__controls"],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$file$2d$upload$2d$trigger$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadTrigger"], {
                                variant: "secondary",
                                size: "toolbar",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__trigger"],
                                name: "file",
                                accept: ".pdf,application/pdf",
                                multiple: true,
                                busy: busy,
                                onChange: (event)=>{
                                    const files = Array.from(event.target.files || []);
                                    event.target.value = "";
                                    if (files.length) void upload(files);
                                },
                                children: busy ? "正在上传…" : "上传 SO 文件"
                            }, void 0, false, {
                                fileName: "[project]/src/components/so-upload-form.tsx",
                                lineNumber: 95,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$parse$2d$pending$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ParsePendingButton"], {
                                variant: "primary",
                                size: "toolbar",
                                fileIds: recognizableFiles.map((file)=>file.id),
                                requireFiles: true,
                                reloadOnComplete: false,
                                onStatusChange: handleParseStatus,
                                onProgressChange: updateParseProgress
                            }, void 0, false, {
                                fileName: "[project]/src/components/so-upload-form.tsx",
                                lineNumber: 96,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/so-upload-form.tsx",
                        lineNumber: 94,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__status"],
                        children: [
                            busy && fileName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusMessage, {
                                tone: "loading",
                                text: "正在上传：".concat(fileName)
                            }, void 0, false, {
                                fileName: "[project]/src/components/so-upload-form.tsx",
                                lineNumber: 99,
                                columnNumber: 29
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusMessage, {
                                tone: uploadFailures.length || parseFailures.length ? "error" : "info",
                                text: "文件 ".concat(batchFiles.length, " · 上传成功 ").concat(successfulFiles.length, " · 上传失败 ").concat(uploadFailures.length).concat(parseFailures.length ? " · 识别失败 ".concat(parseFailures.length) : "")
                            }, void 0, false, {
                                fileName: "[project]/src/components/so-upload-form.tsx",
                                lineNumber: 99,
                                columnNumber: 90
                            }, this),
                            batchFiles.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "text",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__toggle"],
                                onClick: ()=>setExpanded((value)=>!value),
                                children: expanded ? "收起列表 ▲" : "查看文件 ▼"
                            }, void 0, false, {
                                fileName: "[project]/src/components/so-upload-form.tsx",
                                lineNumber: 100,
                                columnNumber: 35
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/so-upload-form.tsx",
                        lineNumber: 98,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/so-upload-form.tsx",
                lineNumber: 93,
                columnNumber: 5
            }, this),
            (parseStatus === null || parseStatus === void 0 ? void 0 : parseStatus.state) === "running" && parseProgress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__progress"],
                role: "progressbar",
                "aria-valuemin": 0,
                "aria-valuemax": parseProgress.total,
                "aria-valuenow": parseProgress.completed,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "正在识别：",
                            parseProgress.completed,
                            " / ",
                            parseProgress.total
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/so-upload-form.tsx",
                        lineNumber: 103,
                        columnNumber: 227
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            style: {
                                width: "".concat(parseProgress.total ? parseProgress.completed / parseProgress.total * 100 : 0, "%")
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/so-upload-form.tsx",
                            lineNumber: 103,
                            columnNumber: 297
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/so-upload-form.tsx",
                        lineNumber: 103,
                        columnNumber: 294
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/so-upload-form.tsx",
                lineNumber: 103,
                columnNumber: 59
            }, this),
            expanded && batchFiles.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__files"],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    children: batchFiles.map((file)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    title: file.name,
                                    children: file.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/so-upload-form.tsx",
                                    lineNumber: 104,
                                    columnNumber: 142
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                    className: file.upload === "error" || file.parseStatus === "FAILED" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__file-error"] : undefined,
                                    children: file.upload === "uploading" ? "上传中" : file.upload === "error" ? "上传失败：".concat(file.error) : parseLabel[file.parseStatus || "PENDING"]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/so-upload-form.tsx",
                                    lineNumber: 104,
                                    columnNumber: 184
                                }, this),
                                file.upload === "error" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            size: "small",
                                            variant: "secondary",
                                            onClick: ()=>void upload([
                                                    file.source
                                                ], file.key),
                                            children: "重试"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/so-upload-form.tsx",
                                            lineNumber: 104,
                                            columnNumber: 475
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            size: "small",
                                            variant: "danger",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__remove"],
                                            onClick: ()=>dismissFailedUpload(file.key),
                                            children: "删除"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/so-upload-form.tsx",
                                            lineNumber: 104,
                                            columnNumber: 594
                                        }, this)
                                    ]
                                }, void 0, true) : file.parseStatus === "FAILED" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    size: "small",
                                    variant: "text",
                                    onClick: ()=>void retryRecognition(file),
                                    children: "重试识别"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/so-upload-form.tsx",
                                    lineNumber: 104,
                                    columnNumber: 789
                                }, this) : file.parseStatus === "PENDING" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    size: "small",
                                    variant: "danger",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__remove"],
                                    disabled: removingId !== null,
                                    onClick: ()=>setConfirmingRemoval(file),
                                    children: "删除"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/so-upload-form.tsx",
                                    lineNumber: 104,
                                    columnNumber: 932
                                }, this) : null
                            ]
                        }, file.key, true, {
                            fileName: "[project]/src/components/so-upload-form.tsx",
                            lineNumber: 104,
                            columnNumber: 123
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/so-upload-form.tsx",
                    lineNumber: 104,
                    columnNumber: 95
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/so-upload-form.tsx",
                lineNumber: 104,
                columnNumber: 43
            }, this),
            confirmingRemoval && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$delete$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeleteConfirmDialog"], {
                title: "确认删除此上传？",
                busy: removingId === confirmingRemoval.id,
                onClose: ()=>setConfirmingRemoval(null),
                onConfirm: removeUploaded,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        "将删除“",
                        confirmingRemoval.name,
                        "”及其待识别 SO，且无法恢复。"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/so-upload-form.tsx",
                    lineNumber: 105,
                    columnNumber: 178
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/so-upload-form.tsx",
                lineNumber: 105,
                columnNumber: 27
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/so-upload-form.tsx",
        lineNumber: 91,
        columnNumber: 10
    }, this);
}
_s(SoUploadForm, "V3A/KzfyFqLQPgqg73biH2DhmnE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SoUploadForm;
function StatusMessage(param) {
    let { tone, text } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__status-message"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__status-message--".concat(tone)]
        ].join(" "),
        title: text,
        role: tone === "error" ? "alert" : "status",
        children: [
            tone === "loading" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__status-icon"],
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/so-upload-form.tsx",
                lineNumber: 111,
                columnNumber: 28
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["so-upload__status-text"],
                children: text
            }, void 0, false, {
                fileName: "[project]/src/components/so-upload-form.tsx",
                lineNumber: 112,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/so-upload-form.tsx",
        lineNumber: 110,
        columnNumber: 10
    }, this);
}
_c1 = StatusMessage;
var _c, _c1;
__turbopack_context__.k.register(_c, "SoUploadForm");
__turbopack_context__.k.register(_c1, "StatusMessage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_5fde0f22._.js.map