(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
]);

//# sourceMappingURL=src_components_ui_dd16aa08._.js.map