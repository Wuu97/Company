module.exports = [
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
"[project]/src/components/ui/form-field.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "checkbox": "form-field-module__WhHEnW__checkbox",
  "control": "form-field-module__WhHEnW__control",
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].control,
                required: required,
                "aria-invalid": Boolean(error) || undefined,
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 26,
                columnNumber: 89
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].error,
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 26,
                columnNumber: 209
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form-controls.tsx",
        lineNumber: 26,
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
                lineNumber: 31,
                columnNumber: 89
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].error,
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 31,
                columnNumber: 272
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form-controls.tsx",
        lineNumber: 31,
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
                lineNumber: 36,
                columnNumber: 89
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$field$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].error,
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 36,
                columnNumber: 212
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form-controls.tsx",
        lineNumber: 36,
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
                lineNumber: 47,
                columnNumber: 84
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 47,
                columnNumber: 120
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                children: hint
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form-controls.tsx",
                lineNumber: 47,
                columnNumber: 152
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form-controls.tsx",
        lineNumber: 47,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/auth-form.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "form": "auth-form-module__UaVI8G__form",
});
}),
"[project]/src/components/auth-form.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthForm",
    ()=>AuthForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/user-feedback.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/feedback-message.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-controls.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2d$form$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/auth-form.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
;
;
function AuthForm({ mode }) {
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const setup = mode === "setup";
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        setBusy(true);
        setMessage("");
        const form = new FormData(event.currentTarget);
        try {
            const response = await fetch(`/api/auth/${mode}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(Object.fromEntries(form))
            });
            if (response.ok) location.href = "/";
            else setMessage(setup ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].retry("创建账号") : "邮箱或密码不正确，请重新输入。");
        } catch  {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2d$form$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].form,
        onSubmit: submit,
        children: [
            setup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                label: "姓名",
                name: "name",
                placeholder: "请填写姓名",
                required: true,
                minLength: 2,
                disabled: busy
            }, void 0, false, {
                fileName: "[project]/src/components/auth-form.tsx",
                lineNumber: 41,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                label: "邮箱",
                name: "email",
                type: "email",
                placeholder: "name@company.com",
                required: true,
                disabled: busy
            }, void 0, false, {
                fileName: "[project]/src/components/auth-form.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                label: "密码",
                name: "password",
                type: "password",
                placeholder: setup ? "至少 8 位" : "请输入密码",
                required: true,
                minLength: setup ? 8 : undefined,
                disabled: busy
            }, void 0, false, {
                fileName: "[project]/src/components/auth-form.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                type: "submit",
                wide: true,
                disabled: busy,
                children: busy ? "处理中…" : setup ? "创建账号并进入系统" : "登录"
            }, void 0, false, {
                fileName: "[project]/src/components/auth-form.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                tone: "error",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/auth-form.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/auth-form.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_d498a1d6._.js.map