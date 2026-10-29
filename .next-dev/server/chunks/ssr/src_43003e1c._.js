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
"[project]/src/components/customer-form.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomerForm",
    ()=>CustomerForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/business.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
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
;
function CustomerForm() {
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        const form = event.currentTarget;
        const data = new FormData(form);
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch("/api/customers", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    code: data.get("code"),
                    name: data.get("name")
                })
            });
            if (response.ok) {
                form.reset();
                setMessage("客户已创建。");
                router.refresh();
            } else setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].retry("创建客户"));
        } catch  {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "新增客户"
            }, void 0, false, {
                fileName: "[project]/src/components/customer-form.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["master-data-form"],
                onSubmit: submit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                        label: "客户编码",
                        name: "code",
                        placeholder: "如：CUST-001",
                        required: true,
                        disabled: busy
                    }, void 0, false, {
                        fileName: "[project]/src/components/customer-form.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                        label: "客户名称",
                        name: "name",
                        placeholder: "公司全称",
                        required: true,
                        disabled: busy
                    }, void 0, false, {
                        fileName: "[project]/src/components/customer-form.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        type: "submit",
                        disabled: busy,
                        children: busy ? "保存中…" : "创建客户"
                    }, void 0, false, {
                        fileName: "[project]/src/components/customer-form.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customer-form.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/customer-form.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/customer-form.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/factory-form.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FactoryForm",
    ()=>FactoryForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/business.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
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
;
function FactoryForm({ customers }) {
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        const form = event.currentTarget;
        const data = new FormData(form);
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch(`/api/customers/${String(data.get("customerId"))}/factories`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: data.get("name"),
                    address: data.get("address")
                })
            });
            if (response.ok) {
                form.reset();
                setMessage("工厂已创建。");
                router.refresh();
            } else setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].retry("创建工厂"));
        } catch  {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "新增工厂"
            }, void 0, false, {
                fileName: "[project]/src/components/factory-form.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["master-data-form"],
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["master-data-form--factory"]
                ].join(" "),
                onSubmit: submit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectField"], {
                        label: "所属客户",
                        name: "customerId",
                        required: true,
                        disabled: busy,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "选择客户"
                            }, void 0, false, {
                                fileName: "[project]/src/components/factory-form.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this),
                            customers.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: customer.id,
                                    children: customer.name
                                }, customer.id, false, {
                                    fileName: "[project]/src/components/factory-form.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/factory-form.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                        label: "工厂名称",
                        name: "name",
                        placeholder: "工厂名称",
                        required: true,
                        disabled: busy
                    }, void 0, false, {
                        fileName: "[project]/src/components/factory-form.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                        label: "装柜地址",
                        name: "address",
                        placeholder: "详细地址",
                        required: true,
                        disabled: busy
                    }, void 0, false, {
                        fileName: "[project]/src/components/factory-form.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        type: "submit",
                        disabled: busy,
                        children: busy ? "保存中…" : "创建工厂"
                    }, void 0, false, {
                        fileName: "[project]/src/components/factory-form.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/factory-form.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                children: message
            }, void 0, false, {
                fileName: "[project]/src/components/factory-form.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/factory-form.tsx",
        lineNumber: 50,
        columnNumber: 5
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
"[project]/src/components/customer-record-forms.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomerRecordForm",
    ()=>CustomerRecordForm,
    "FactoryRecordForm",
    ()=>FactoryRecordForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/business.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/user-feedback.ts [app-ssr] (ecmascript)");
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
function CustomerRecordForm({ customer }) {
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        const form = new FormData(event.currentTarget);
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch(`/api/customers/${customer.id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    code: form.get("code"),
                    name: form.get("name"),
                    active: form.get("active") === "on"
                })
            });
            if (response.ok) {
                setMessage("客户档案已保存。");
                router.refresh();
            } else setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].retry("保存客户档案"));
        } catch  {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Disclosure"], {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["record-editor"],
        title: "编辑客户档案",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: submit,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "客户编码",
                    name: "code",
                    defaultValue: customer.code,
                    required: true,
                    disabled: busy
                }, void 0, false, {
                    fileName: "[project]/src/components/customer-record-forms.tsx",
                    lineNumber: 13,
                    columnNumber: 913
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "客户名称",
                    name: "name",
                    defaultValue: customer.name,
                    required: true,
                    disabled: busy
                }, void 0, false, {
                    fileName: "[project]/src/components/customer-record-forms.tsx",
                    lineNumber: 13,
                    columnNumber: 1004
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckboxField"], {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["record-editor__check"],
                    name: "active",
                    defaultChecked: customer.active,
                    disabled: busy,
                    children: "启用此客户"
                }, void 0, false, {
                    fileName: "[project]/src/components/customer-record-forms.tsx",
                    lineNumber: 13,
                    columnNumber: 1095
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    type: "submit",
                    size: "small",
                    wide: "mobile",
                    disabled: busy,
                    children: busy ? "正在保存…" : "保存客户档案"
                }, void 0, false, {
                    fileName: "[project]/src/components/customer-record-forms.tsx",
                    lineNumber: 13,
                    columnNumber: 1245
                }, this),
                message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                    as: "small",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/components/customer-record-forms.tsx",
                    lineNumber: 13,
                    columnNumber: 1358
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/customer-record-forms.tsx",
            lineNumber: 13,
            columnNumber: 889
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/customer-record-forms.tsx",
        lineNumber: 13,
        columnNumber: 818
    }, this);
}
function FactoryRecordForm({ customerId, factory }) {
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        const form = new FormData(event.currentTarget);
        const text = (name)=>String(form.get(name) || "") || null;
        setBusy(true);
        setMessage("");
        try {
            const response = await fetch(`/api/customers/${customerId}/factories/${factory.id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: form.get("name"),
                    address: form.get("address"),
                    contactName: text("contactName"),
                    contactPhone: text("contactPhone")
                })
            });
            if (response.ok) {
                setMessage("工厂档案已保存。");
                router.refresh();
            } else setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].retry("保存工厂档案"));
        } catch  {
            setMessage(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$feedback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFeedback"].network);
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Disclosure"], {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"]["record-editor"],
        title: "编辑工厂信息",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: submit,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "工厂名称",
                    name: "name",
                    defaultValue: factory.name,
                    required: true,
                    disabled: busy
                }, void 0, false, {
                    fileName: "[project]/src/components/customer-record-forms.tsx",
                    lineNumber: 15,
                    columnNumber: 1072
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "装柜地址",
                    name: "address",
                    defaultValue: factory.address,
                    required: true,
                    disabled: busy
                }, void 0, false, {
                    fileName: "[project]/src/components/customer-record-forms.tsx",
                    lineNumber: 15,
                    columnNumber: 1162
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "联系人（可选）",
                    name: "contactName",
                    defaultValue: factory.contactName || "",
                    disabled: busy
                }, void 0, false, {
                    fileName: "[project]/src/components/customer-record-forms.tsx",
                    lineNumber: 15,
                    columnNumber: 1258
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextField"], {
                    label: "联系电话（可选）",
                    name: "contactPhone",
                    defaultValue: factory.contactPhone || "",
                    disabled: busy
                }, void 0, false, {
                    fileName: "[project]/src/components/customer-record-forms.tsx",
                    lineNumber: 15,
                    columnNumber: 1362
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    type: "submit",
                    size: "small",
                    wide: "mobile",
                    disabled: busy,
                    children: busy ? "正在保存…" : "保存工厂信息"
                }, void 0, false, {
                    fileName: "[project]/src/components/customer-record-forms.tsx",
                    lineNumber: 15,
                    columnNumber: 1469
                }, this),
                message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                    as: "small",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/components/customer-record-forms.tsx",
                    lineNumber: 15,
                    columnNumber: 1582
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/customer-record-forms.tsx",
            lineNumber: 15,
            columnNumber: 1048
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/customer-record-forms.tsx",
        lineNumber: 15,
        columnNumber: 977
    }, this);
}
}),
];

//# sourceMappingURL=src_43003e1c._.js.map