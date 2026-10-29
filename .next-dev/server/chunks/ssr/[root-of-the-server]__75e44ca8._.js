module.exports = [
"[project]/.next-internal/server/app/logs/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/audit.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/components/ui/list.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

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
"[project]/src/components/ui/filter-select.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "FilterSelect",
    ()=>FilterSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const FilterSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FilterSelect() from the server but FilterSelect is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ui/filter-select.tsx <module evaluation>", "FilterSelect");
}),
"[project]/src/components/ui/filter-select.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "FilterSelect",
    ()=>FilterSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const FilterSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FilterSelect() from the server but FilterSelect is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ui/filter-select.tsx", "FilterSelect");
}),
"[project]/src/components/ui/filter-select.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/ui/filter-select.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/ui/filter-select.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/ui/list.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/list.module.css [app-rsc] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/filter-select.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
const ListFilter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"])(function ListFilter({ className, children, ...props }, ref) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        ref: ref,
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].filter,
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
function FilterField({ label, children, className, search = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].field,
            search ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].search : undefined,
            className
        ].filter(Boolean).join(" "),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
function FilterTextField({ className, compact = false, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].control,
            compact ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].controlCompact : undefined,
            className
        ].filter(Boolean).join(" "),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, this);
}
function FilterSelectField({ children, className, compact = false, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$filter$2d$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FilterSelect"], {
        className: className,
        triggerClassName: compact ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].selectTriggerCompact : undefined,
        optionClassName: compact ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].selectOptionCompact : undefined,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
function FilterActions({ className, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].actions,
            className
        ].filter(Boolean).join(" "),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 28,
        columnNumber: 10
    }, this);
}
function FilterClearLink({ href, children = "清除筛选", className, size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ButtonLink"], {
        variant: "secondary",
        size: size,
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].clear,
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
function FilterActionLink({ href, children, className, size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ButtonLink"], {
        size: size,
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].clear,
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
function ResultSummary({ className, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].summary,
            className
        ].filter(Boolean).join(" "),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/list.tsx",
        lineNumber: 40,
        columnNumber: 10
    }, this);
}
function Pagination({ currentPage, totalPages, href, label }) {
    if (totalPages <= 1) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].pagination,
        "aria-label": label,
        children: [
            currentPage > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: href(currentPage - 1),
                children: "上一页"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/list.tsx",
                lineNumber: 47,
                columnNumber: 84
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            currentPage < totalPages && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
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
}),
"[project]/src/components/ui/data-table.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "empty": "data-table-module__MlXFEa__empty",
  "hint": "data-table-module__MlXFEa__hint",
  "table": "data-table-module__MlXFEa__table",
  "wrap": "data-table-module__MlXFEa__wrap",
});
}),
"[project]/src/components/ui/data-table.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataTable",
    ()=>DataTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$data$2d$table$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/data-table.module.css [app-rsc] (css module)");
;
;
function DataTable({ children, className, mobileHint = "表格可左右滑动查看完整内容。", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$data$2d$table$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].hint,
                children: mobileHint
            }, void 0, false, {
                fileName: "[project]/src/components/ui/data-table.tsx",
                lineNumber: 5,
                columnNumber: 12
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$data$2d$table$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].wrap,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: [
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$data$2d$table$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].table,
                        className
                    ].filter(Boolean).join(" "),
                    ...props,
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/data-table.tsx",
                    lineNumber: 5,
                    columnNumber: 84
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/data-table.tsx",
                lineNumber: 5,
                columnNumber: 55
            }, this)
        ]
    }, void 0, true);
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
"[project]/src/components/ui/disclosure.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "content": "disclosure-module___9sabG__content",
  "disclosure": "disclosure-module___9sabG__disclosure",
  "summary": "disclosure-module___9sabG__summary",
});
}),
"[project]/src/components/ui/disclosure.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Disclosure",
    ()=>Disclosure
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ui/disclosure.module.css [app-rsc] (css module)");
;
;
function Disclosure({ title, children, className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
        className: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].disclosure,
            className
        ].filter(Boolean).join(" "),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].summary,
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/disclosure.tsx",
                lineNumber: 5,
                columnNumber: 99
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].content,
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
"[project]/src/app/logs/page.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "advanced": "page-module__XfLKIq__advanced",
  "changeContent": "page-module__XfLKIq__changeContent",
  "entity": "page-module__XfLKIq__entity",
});
}),
"[project]/src/app/logs/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Logs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/business.module.css [app-rsc] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/audit.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/list.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/data-table.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/status-badge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/disclosure.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/page-header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$logs$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/logs/page.module.css [app-rsc] (css module)");
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
const pageSize = 100;
const fieldLabels = {
    status: "状态",
    soNumber: "SO 编号",
    carrier: "船公司",
    vesselName: "船名",
    voyage: "航次",
    containerType: "柜型",
    containerNo: "实际柜号",
    internalCode: "内部柜号",
    quantity: "数量",
    scheduledAt: "计划时间",
    expectedLoadingAt: "预计装柜时间",
    etbAt: "预计靠港时间",
    source: "信息来源",
    note: "备注",
    customerId: "客户",
    factoryId: "工厂",
    loadingPlanId: "装柜计划",
    transportTaskId: "运输任务",
    vehicleNo: "车牌",
    driverName: "司机",
    driverPhone: "联系电话",
    amount: "金额",
    currency: "币种",
    category: "费用类型",
    active: "启用状态"
};
function displayValue(value) {
    if (value === null || value === undefined || value === "") return "未填写";
    if (typeof value === "boolean") return value ? "是" : "否";
    if (Array.isArray(value)) return value.length ? value.join("、") : "无";
    if (typeof value === "object") return "已更新";
    return String(value);
}
function changeRows(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    return Object.entries(value).map(([key, item])=>({
            label: fieldLabels[key] || key,
            value: displayValue(item)
        }));
}
function entityLink(entityType, entityId) {
    if (entityType === "SoOrder") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: `/orders/${entityId}`,
        children: "查看订单"
    }, void 0, false, {
        fileName: "[project]/src/app/logs/page.tsx",
        lineNumber: 65,
        columnNumber: 12
    }, this);
    if (entityType === "Sailing") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: `/sailings/${entityId}`,
        children: "查看船期"
    }, void 0, false, {
        fileName: "[project]/src/app/logs/page.tsx",
        lineNumber: 67,
        columnNumber: 12
    }, this);
    return null;
}
function changeDetail(before, after, entityId) {
    const beforeRows = changeRows(before);
    const afterRows = changeRows(after);
    if (!beforeRows.length && !afterRows.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$business$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"]["muted"],
        children: "本次未记录字段变化"
    }, void 0, false, {
        fileName: "[project]/src/app/logs/page.tsx",
        lineNumber: 74,
        columnNumber: 12
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Disclosure"], {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$logs$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].changeDetail,
        title: "查看变更摘要",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$logs$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].changeContent,
            children: [
                beforeRows.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "变更前"
                        }, void 0, false, {
                            fileName: "[project]/src/app/logs/page.tsx",
                            lineNumber: 80,
                            columnNumber: 13
                        }, this),
                        beforeRows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: row.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/logs/page.tsx",
                                        lineNumber: 83,
                                        columnNumber: 17
                                    }, this),
                                    row.value
                                ]
                            }, `before-${row.label}`, true, {
                                fileName: "[project]/src/app/logs/page.tsx",
                                lineNumber: 82,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/logs/page.tsx",
                    lineNumber: 79,
                    columnNumber: 11
                }, this) : null,
                afterRows.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "变更后"
                        }, void 0, false, {
                            fileName: "[project]/src/app/logs/page.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this),
                        afterRows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: row.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/logs/page.tsx",
                                        lineNumber: 94,
                                        columnNumber: 17
                                    }, this),
                                    row.value
                                ]
                            }, `after-${row.label}`, true, {
                                fileName: "[project]/src/app/logs/page.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/logs/page.tsx",
                    lineNumber: 90,
                    columnNumber: 11
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                    children: [
                        "记录编号：",
                        entityId
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/logs/page.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/logs/page.tsx",
            lineNumber: 77,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/logs/page.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
function href(input, page) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(input))if (value && key !== "page") params.set(key, value);
    params.set("page", String(page));
    return `/logs?${params}`;
}
async function Logs({ searchParams }) {
    const input = await searchParams;
    const q = input.q?.trim() || "";
    const page = Math.max(1, Number(input.page) || 1);
    const activeFilterCount = [
        q,
        input.action,
        input.entityType
    ].filter(Boolean).length;
    const where = {
        ...input.action ? {
            action: input.action
        } : {},
        ...input.entityType ? {
            entityType: input.entityType
        } : {},
        ...q ? {
            OR: [
                {
                    actorName: {
                        contains: q,
                        mode: "insensitive"
                    }
                },
                {
                    entityId: {
                        contains: q,
                        mode: "insensitive"
                    }
                }
            ]
        } : {}
    };
    const [total, actionRows, entityRows] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].operationLog.count({
            where
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].operationLog.findMany({
            distinct: [
                "action"
            ],
            select: {
                action: true
            },
            orderBy: {
                action: "asc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].operationLog.findMany({
            distinct: [
                "entityType"
            ],
            select: {
                entityType: true
            },
            orderBy: {
                entityType: "asc"
            }
        })
    ]);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, totalPages);
    const logs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].operationLog.findMany({
        where,
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * pageSize,
        take: pageSize
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: "操作日志",
                description: "查看业务操作和系统处理记录。展开“查看变更摘要”可核对本次修改的业务字段。"
            }, void 0, false, {
                fileName: "[project]/src/app/logs/page.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ListFilter"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$logs$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].filter,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FilterField"], {
                        label: "查找操作人或记录编号",
                        search: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FilterTextField"], {
                            name: "q",
                            defaultValue: q,
                            placeholder: "输入姓名或记录编号"
                        }, void 0, false, {
                            fileName: "[project]/src/app/logs/page.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/logs/page.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$disclosure$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Disclosure"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$logs$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].advanced,
                        title: "按操作类型或业务对象筛选",
                        open: Boolean(input.action || input.entityType),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FilterField"], {
                                    label: "操作类型",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FilterSelectField"], {
                                        name: "action",
                                        defaultValue: input.action || "",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "全部"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/logs/page.tsx",
                                                lineNumber: 168,
                                                columnNumber: 17
                                            }, this),
                                            actionRows.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: item.action,
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActionLabel"])(item.action)
                                                }, item.action, false, {
                                                    fileName: "[project]/src/app/logs/page.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/logs/page.tsx",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/logs/page.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FilterField"], {
                                    label: "业务对象",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FilterSelectField"], {
                                        name: "entityType",
                                        defaultValue: input.entityType || "",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "全部"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/logs/page.tsx",
                                                lineNumber: 178,
                                                columnNumber: 17
                                            }, this),
                                            entityRows.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: item.entityType,
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditEntityLabel"])(item.entityType)
                                                }, item.entityType, false, {
                                                    fileName: "[project]/src/app/logs/page.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/logs/page.tsx",
                                        lineNumber: 177,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/logs/page.tsx",
                                    lineNumber: 176,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/logs/page.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/logs/page.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FilterActions"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$logs$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].filterActions,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                type: "submit",
                                children: "查看记录"
                            }, void 0, false, {
                                fileName: "[project]/src/app/logs/page.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FilterClearLink"], {
                                href: "/logs"
                            }, void 0, false, {
                                fileName: "[project]/src/app/logs/page.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/logs/page.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/logs/page.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ResultSummary"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$logs$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].resultSummary,
                children: [
                    activeFilterCount ? `已使用 ${activeFilterCount} 个筛选条件，` : "",
                    "共",
                    " ",
                    total,
                    " 条，第 ",
                    currentPage,
                    " / ",
                    totalPages,
                    " 页。"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/logs/page.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    children: "时间"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/logs/page.tsx",
                                    lineNumber: 200,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    children: "操作人"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/logs/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    children: "操作"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/logs/page.tsx",
                                    lineNumber: 202,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    children: "业务对象"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/logs/page.tsx",
                                    lineNumber: 203,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    children: "变更内容"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/logs/page.tsx",
                                    lineNumber: 204,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/logs/page.tsx",
                            lineNumber: 199,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/logs/page.tsx",
                        lineNumber: 198,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        children: logs.length ? logs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: log.createdAt.toLocaleString("zh-CN")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/logs/page.tsx",
                                        lineNumber: 211,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: log.actorName ? `${log.actorName}（${log.actorRole === "ADMIN" ? "负责人" : "成员"}）` : "系统处理"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/logs/page.tsx",
                                        lineNumber: 212,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                            tone: "muted",
                                            size: "small",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditActionLabel"])(log.action)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/logs/page.tsx",
                                            lineNumber: 218,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/logs/page.tsx",
                                        lineNumber: 217,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$logs$2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].entity,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$audit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auditEntityLabel"])(log.entityType)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/logs/page.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 23
                                                }, this),
                                                entityLink(log.entityType, log.entityId)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/logs/page.tsx",
                                            lineNumber: 223,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/logs/page.tsx",
                                        lineNumber: 222,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: changeDetail(log.before, log.after, log.entityId)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/logs/page.tsx",
                                        lineNumber: 228,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, log.id, true, {
                                fileName: "[project]/src/app/logs/page.tsx",
                                lineNumber: 210,
                                columnNumber: 17
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                colSpan: 5,
                                children: "暂无符合条件的操作记录。"
                            }, void 0, false, {
                                fileName: "[project]/src/app/logs/page.tsx",
                                lineNumber: 233,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/logs/page.tsx",
                            lineNumber: 232,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/logs/page.tsx",
                        lineNumber: 207,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/logs/page.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Pagination"], {
                currentPage: currentPage,
                totalPages: totalPages,
                href: (page)=>href(input, page),
                label: "操作日志分页"
            }, void 0, false, {
                fileName: "[project]/src/app/logs/page.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/src/app/logs/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/logs/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__75e44ca8._.js.map