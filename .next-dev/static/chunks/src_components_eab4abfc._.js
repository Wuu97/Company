(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/src/components/ui/disclosure.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "content": "disclosure-module___9sabG__content",
  "disclosure": "disclosure-module___9sabG__disclosure",
  "summary": "disclosure-module___9sabG__summary",
});
}),
"[project]/src/components/ui/disclosure.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Disclosure",
    ()=>Disclosure
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/disclosure.module.css [app-client] (css module)");
;
;
function Disclosure(param) {
    let { title, children, className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].disclosure,
            className
        ].filter(Boolean).join(" "),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].summary,
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/disclosure.tsx",
                lineNumber: 5,
                columnNumber: 99
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].content,
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
_c = Disclosure;
var _c;
__turbopack_context__.k.register(_c, "Disclosure");
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
"[project]/src/components/ui/empty-state.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "emptyState": "empty-state-module__9TuPeG__emptyState",
});
}),
"[project]/src/components/ui/empty-state.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmptyState",
    ()=>EmptyState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$empty$2d$state$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/empty-state.module.css [app-client] (css module)");
;
;
function EmptyState(param) {
    let { title, children, className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$empty$2d$state$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].emptyState,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/empty-state.tsx",
                lineNumber: 8,
                columnNumber: 88
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/empty-state.tsx",
                lineNumber: 8,
                columnNumber: 104
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/empty-state.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
_c = EmptyState;
var _c;
__turbopack_context__.k.register(_c, "EmptyState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/record-card.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "record-card-module__m4lmHW__actions",
  "actionscompact": "record-card-module__m4lmHW__actionscompact",
  "card": "record-card-module__m4lmHW__card",
  "cardcompact": "record-card-module__m4lmHW__cardcompact",
  "columns2": "record-card-module__m4lmHW__columns2",
  "columns3": "record-card-module__m4lmHW__columns3",
  "columns4": "record-card-module__m4lmHW__columns4",
  "field": "record-card-module__m4lmHW__field",
  "fieldcompact": "record-card-module__m4lmHW__fieldcompact",
  "fields": "record-card-module__m4lmHW__fields",
  "fieldscompact": "record-card-module__m4lmHW__fieldscompact",
  "fullOnMobile": "record-card-module__m4lmHW__fullOnMobile",
  "header": "record-card-module__m4lmHW__header",
  "headercompact": "record-card-module__m4lmHW__headercompact",
  "list": "record-card-module__m4lmHW__list",
  "listcompact": "record-card-module__m4lmHW__listcompact",
});
}),
"[project]/src/components/ui/record-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RecordCard",
    ()=>RecordCard,
    "RecordCardActions",
    ()=>RecordCardActions,
    "RecordCardField",
    ()=>RecordCardField,
    "RecordCardFields",
    ()=>RecordCardFields,
    "RecordCardHeader",
    ()=>RecordCardHeader,
    "RecordCardList",
    ()=>RecordCardList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/record-card.module.css [app-client] (css module)");
;
;
function classes() {
    for(var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++){
        values[_key] = arguments[_key];
    }
    return values.filter(Boolean).join(" ");
}
function RecordCard(param) {
    let { className, children, density = "default", ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: classes(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["card".concat(density)], className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/record-card.tsx",
        lineNumber: 14,
        columnNumber: 10
    }, this);
}
_c = RecordCard;
function RecordCardHeader(param) {
    let { className, children, density = "default", ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["header".concat(density)], className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/record-card.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = RecordCardHeader;
function RecordCardFields(param) {
    let { className, children, density = "default", columns = "auto", ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fields, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["fields".concat(density)], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["columns".concat(columns)], className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/record-card.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
_c2 = RecordCardFields;
function RecordCardField(param) {
    let { className, children, density = "default", fullOnMobile = false, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].field, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["field".concat(density)], fullOnMobile && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fullOnMobile, className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/record-card.tsx",
        lineNumber: 26,
        columnNumber: 10
    }, this);
}
_c3 = RecordCardField;
function RecordCardActions(param) {
    let { className, children, density = "default", ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actions, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["actions".concat(density)], className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/record-card.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_c4 = RecordCardActions;
function RecordCardList(param) {
    let { className, children, density = "default", ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].list, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["list".concat(density)], className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/record-card.tsx",
        lineNumber: 34,
        columnNumber: 10
    }, this);
}
_c5 = RecordCardList;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "RecordCard");
__turbopack_context__.k.register(_c1, "RecordCardHeader");
__turbopack_context__.k.register(_c2, "RecordCardFields");
__turbopack_context__.k.register(_c3, "RecordCardField");
__turbopack_context__.k.register(_c4, "RecordCardActions");
__turbopack_context__.k.register(_c5, "RecordCardList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/status-badge.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "badge": "status-badge-module__BLtyLW__badge",
  "critical": "status-badge-module__BLtyLW__critical",
  "interactive": "status-badge-module__BLtyLW__interactive",
  "muted": "status-badge-module__BLtyLW__muted",
  "small": "status-badge-module__BLtyLW__small",
  "success": "status-badge-module__BLtyLW__success",
  "unread": "status-badge-module__BLtyLW__unread",
  "warning": "status-badge-module__BLtyLW__warning",
});
}),
"[project]/src/components/ui/status-badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatusBadge",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/status-badge.module.css [app-client] (css module)");
"use client";
;
;
function StatusBadge(param) {
    let { children, tone, className, size = "default", onClick, title } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].badge,
            tone && tone !== "default" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"][tone] : undefined,
            size === "small" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].small : undefined,
            onClick ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].interactive : undefined,
            className
        ].filter(Boolean).join(" "),
        title: title,
        role: onClick ? "button" : undefined,
        tabIndex: onClick ? 0 : undefined,
        onClick: onClick,
        onKeyDown: (event)=>{
            if (onClick && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                onClick();
            }
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/status-badge.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
_c = StatusBadge;
var _c;
__turbopack_context__.k.register(_c, "StatusBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/resource-records.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResourceRecords",
    ()=>ResourceRecords
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form-controls.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/disclosure.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/feedback-message.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/empty-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/record-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/status-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/business.module.css [app-client] (css module)");
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
;
;
const labels = {
    drivers: {
        singular: "司机",
        code: "司机编码",
        name: "司机姓名",
        description: "维护自有司机资料，供派车、工资账单和路线工资标准直接选择。"
    },
    "fleet-owners": {
        singular: "合作车老板",
        code: "合作车编码",
        name: "合作车老板/车队名称",
        description: "维护合作车老板或车队资料，供派车和合作车月结账单直接选择。"
    },
    "temporary-vehicles": {
        singular: "临时车",
        code: "车牌号",
        name: "车型",
        description: "维护临时现金车资料；临时车不自动进入合作车月结。"
    }
};
async function call(url, method, body) {
    const response = await fetch(url, {
        method,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "保存失败");
    return data;
}
function ResourceRecords(param) {
    let { kind, rows } = param;
    _s();
    const label = labels[kind];
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isVehicle = kind === "temporary-vehicles";
    async function submit(event, id) {
        event.preventDefault();
        if (busy) return;
        const data = new FormData(event.currentTarget);
        const body = isVehicle ? {
            plateNumber: data.get("plateNumber"),
            vehicleType: String(data.get("vehicleType") || "") || null,
            active: data.get("active") === "on"
        } : {
            code: data.get("code"),
            name: data.get("name"),
            phone: String(data.get("phone") || "") || null,
            active: data.get("active") === "on"
        };
        setBusy(true);
        setMessage("");
        try {
            await call("/api/resources/".concat(kind).concat(id ? "/".concat(id) : ""), id ? "PATCH" : "POST", body);
            event.currentTarget.reset();
            setMessage("".concat(label.singular, "档案已保存。"));
            router.refresh();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "保存失败，请重试。 ");
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: [
                            "新增",
                            label.singular
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/resource-records.tsx",
                        lineNumber: 40,
                        columnNumber: 14
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["master-data-form"],
                        onSubmit: (event)=>submit(event),
                        children: [
                            isVehicle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                        label: "车牌号",
                                        name: "plateNumber",
                                        placeholder: "如：粤B12345",
                                        required: true,
                                        disabled: busy
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/resource-records.tsx",
                                        lineNumber: 41,
                                        columnNumber: 22
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                        label: "车型（可选）",
                                        name: "vehicleType",
                                        placeholder: "如：集装箱拖车",
                                        disabled: busy
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/resource-records.tsx",
                                        lineNumber: 41,
                                        columnNumber: 114
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                        label: label.code,
                                        name: "code",
                                        placeholder: kind === "drivers" ? "如：DRV-001" : "如：FLEET-001",
                                        required: true,
                                        disabled: busy
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/resource-records.tsx",
                                        lineNumber: 41,
                                        columnNumber: 206
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                        label: label.name,
                                        name: "name",
                                        required: true,
                                        disabled: busy
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/resource-records.tsx",
                                        lineNumber: 41,
                                        columnNumber: 337
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                        label: "联系电话（可选）",
                                        name: "phone",
                                        disabled: busy
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/resource-records.tsx",
                                        lineNumber: 41,
                                        columnNumber: 405
                                    }, this)
                                ]
                            }, void 0, true),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "submit",
                                disabled: busy,
                                children: busy ? "保存中…" : "创建".concat(label.singular)
                            }, void 0, false, {
                                fileName: "[project]/src/components/resource-records.tsx",
                                lineNumber: 42,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/resource-records.tsx",
                        lineNumber: 40,
                        columnNumber: 41
                    }, this),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$feedback$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeedbackMessage"], {
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/src/components/resource-records.tsx",
                        lineNumber: 43,
                        columnNumber: 24
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/resource-records.tsx",
                lineNumber: 40,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RecordCardList"], {
                density: "compact",
                children: rows.length ? rows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RecordCard"], {
                        density: "compact",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$record$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RecordCardHeader"], {
                                density: "compact",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["muted"],
                                                children: isVehicle ? "临时车" : label.singular
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/resource-records.tsx",
                                                lineNumber: 44,
                                                columnNumber: 154
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: isVehicle ? row.plateNumber : row.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/resource-records.tsx",
                                                lineNumber: 44,
                                                columnNumber: 239
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                children: isVehicle ? row.vehicleType || "车型未填写" : "".concat(row.code).concat(row.phone ? " · ".concat(row.phone) : "")
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/resource-records.tsx",
                                                lineNumber: 44,
                                                columnNumber: 286
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/resource-records.tsx",
                                        lineNumber: 44,
                                        columnNumber: 149
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                        tone: row.active ? "success" : "muted",
                                        children: row.active ? "启用" : "停用"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/resource-records.tsx",
                                        lineNumber: 44,
                                        columnNumber: 400
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/resource-records.tsx",
                                lineNumber: 44,
                                columnNumber: 113
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Disclosure"], {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["record-editor"],
                                title: "编辑档案",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: (event)=>submit(event, row.id),
                                    children: [
                                        isVehicle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                                    label: "车牌号",
                                                    name: "plateNumber",
                                                    defaultValue: row.plateNumber,
                                                    required: true,
                                                    disabled: busy
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/resource-records.tsx",
                                                    lineNumber: 44,
                                                    columnNumber: 644
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                                    label: "车型（可选）",
                                                    name: "vehicleType",
                                                    defaultValue: row.vehicleType || "",
                                                    disabled: busy
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/resource-records.tsx",
                                                    lineNumber: 44,
                                                    columnNumber: 743
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                                    label: label.code,
                                                    name: "code",
                                                    defaultValue: row.code,
                                                    required: true,
                                                    disabled: busy
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/resource-records.tsx",
                                                    lineNumber: 44,
                                                    columnNumber: 850
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                                    label: label.name,
                                                    name: "name",
                                                    defaultValue: row.name,
                                                    required: true,
                                                    disabled: busy
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/resource-records.tsx",
                                                    lineNumber: 44,
                                                    columnNumber: 942
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextField"], {
                                                    label: "联系电话（可选）",
                                                    name: "phone",
                                                    defaultValue: row.phone || "",
                                                    disabled: busy
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/resource-records.tsx",
                                                    lineNumber: 44,
                                                    columnNumber: 1034
                                                }, this)
                                            ]
                                        }, void 0, true),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckboxField"], {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"]["record-editor__check"],
                                            name: "active",
                                            defaultChecked: row.active,
                                            disabled: busy,
                                            children: "启用此档案"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/resource-records.tsx",
                                            lineNumber: 44,
                                            columnNumber: 1127
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "submit",
                                            size: "small",
                                            disabled: busy,
                                            children: "保存"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/resource-records.tsx",
                                            lineNumber: 44,
                                            columnNumber: 1272
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/resource-records.tsx",
                                    lineNumber: 44,
                                    columnNumber: 581
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/resource-records.tsx",
                                lineNumber: 44,
                                columnNumber: 512
                            }, this)
                        ]
                    }, row.id, true, {
                        fileName: "[project]/src/components/resource-records.tsx",
                        lineNumber: 44,
                        columnNumber: 70
                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyState"], {
                    title: "暂无".concat(label.singular, "档案"),
                    children: "可使用上方表单新增。"
                }, void 0, false, {
                    fileName: "[project]/src/components/resource-records.tsx",
                    lineNumber: 44,
                    columnNumber: 1371
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/resource-records.tsx",
                lineNumber: 44,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
}
_s(ResourceRecords, "rjcBslb/2HfsI9b/syLc6i0u26I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ResourceRecords;
var _c;
__turbopack_context__.k.register(_c, "ResourceRecords");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_eab4abfc._.js.map