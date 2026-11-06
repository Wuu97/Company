export type AuditActor = { id: string; name: string; role: "ADMIN" | "OPERATOR" };
export function actorFields(actor?: AuditActor) { return actor ? { actorUserId: actor.id, actorName: actor.name, actorRole: actor.role } : {}; }

const actionLabels: Record<string, string> = {
  PLATFORM_ENABLED: "启用平台账号", PLATFORM_DISABLED: "停用平台账号",
  SO_FILE_UPLOADED: "上传 SO 文件", SO_FILE_VERSION_UPLOADED: "上传 SO 新版本", SO_REVIEWED: "人工核对 SO", SO_FIELD_UPDATED: "更新 SO 字段", SO_STATUS_CHANGED: "变更 SO 状态", SO_VERSION_CHANGE_APPLIED: "应用 SO 版本差异", SO_DELETED: "删除 SO", SO_FILE_DELETE_PENDING: "SO 文件待人工删除", SO_CONTAINERS_ADJUSTED: "调整 SO 柜量",
  CONTAINER_CREATED: "创建内部柜子", CONTAINER_NUMBER_UPDATED: "更新实际柜号", CONTAINER_LOADING_COMPLETED: "登记装柜完成与实际柜号", CARGO_ITEM_CREATED: "新增货物明细", CARGO_ITEM_UPDATED: "更新货物明细", CARGO_ITEM_DELETED: "删除货物明细", CUSTOMER_CREATED: "创建客户", CUSTOMER_UPDATED: "更新客户", FACTORY_CREATED: "创建工厂", FACTORY_UPDATED: "更新工厂",
  CUSTOMER_CONFIRMATION_CREATED: "记录客户上柜确认", CUSTOMER_CONFIRMATION_CANCELLED: "取消客户确认", CUSTOMER_CONTACT_TASK_RESOLVED: "处理客户联系待办", ORDER_MILESTONE_UPDATED: "更新单证/执行节点",
  LOADING_PLAN_CREATED: "创建装柜计划", LOADING_PLAN_ADJUSTED: "调整装柜计划", LOADING_PLAN_CANCELLED: "取消装柜计划",
  TRANSPORT_TASK_CREATED: "创建运输任务", TRANSPORT_TASK_STATUS_CHANGED: "更新运输状态", TRANSPORT_LEG_CREATED: "新增运输段", TRANSPORT_COST_CREATED: "新增运输费用", TRANSPORT_COST_UPDATED: "更新运输费用", TRANSPORT_COST_DELETED: "删除运输费用", TRANSPORT_ETB_IMPACT_RESOLVED: "处理运输 ETB 影响", ETB_IMPACTED_DISPATCHED_TRANSPORT: "发现已派车 ETB 影响",
  SAILING_CREATED: "创建船期", SAILING_MANUALLY_SUPPLEMENTED: "人工补录船期", SO_SAILING_LINKED_MANUALLY: "手工关联船期", SO_SAILING_UNLINKED: "解除船期关联", ETB_OBSERVED: "录入 ETB 观测", ETB_CHANGE_DETECTED: "发现 ETB 变化", ETB_ADOPTED: "采用 ETB 业务时间", ETB_QUERY_MANUAL_HANDOFF: "ETB 查询转人工处理", ETB_SOURCE_CREDENTIAL_UPDATED: "更新 ETB 数据源账号", ETB_SOURCE_CREDENTIAL_VIEWED: "查看 ETB 平台密码", ETB_CREDENTIAL_TEST_QUEUED: "发起 ETB 账号验证",
  ROUTE_UPDATED: "更新运输路线", ROUTE_PRICE_CREATED: "新增路线费用", ROUTE_PRICE_STATUS_CHANGED: "变更路线费用状态", SETTLEMENT_BILL_CREATED: "生成结算单", SETTLEMENT_BILL_STATUS_CHANGED: "变更结算单状态",
  SO_PARSE_STATUS_UPDATED: "更新 SO 解析状态", SO_ETB_SAILING_AUTO_LINKED: "自动关联 SO 船期", ETB_QUERY_MANUAL_REQUESTED: "发起人工船期查询", ETB_QUERY_BULK_MANUAL_REQUESTED: "批量发起人工船期查询", ETB_QUERY_WORKER_COMPLETED: "完成船期查询处理", ETB_UNMATCHED_RESULT_MATCHED: "匹配船期查询结果",
  USER_CREATED: "创建家庭成员账号", USER_ENABLED: "启用家庭成员账号", USER_DISABLED: "停用家庭成员账号", USER_PASSWORD_RESET: "重置成员密码", USER_CHANGED_OWN_PASSWORD: "修改本人密码",
  SO_PARSE_JOB_COMPLETED: "执行 SO 解析任务", SO_PARSED: "完成 SO 解析", SO_NUMBER_CORRECTED_FROM_SOURCE_DOCUMENT: "根据来源文件更正 SO 编号", SO_PARSE_LEASE_RECOVERED: "恢复 SO 解析任务",
};

const entityLabels: Record<string, string> = {
  SoOrder: "SO 订单", SoFileVersion: "SO 文件", ContainerUnit: "内部柜子", CargoItem: "货物明细", OrderMilestone: "单证/执行节点", Customer: "客户", Factory: "工厂", CustomerConfirmation: "客户确认", CustomerContactTask: "客户联系待办", LoadingPlan: "装柜计划", TransportTask: "运输任务", TransportCost: "运输费用", Sailing: "船期", EtbQueryRun: "船期查询任务", DataSourceCredential: "船期平台账号", EtbCredentialTestRun: "账号验证", AppUser: "用户账号", Route: "运输路线", RoutePrice: "路线费用标准", SettlementBill: "结算单", System: "系统任务",
};

const fieldLabels: Record<string, string> = {
  siCutoffText: "截补料时间", siCutoffOriginalText: "原始截补料时间", forwarderSiCutoffText: "货代截补料时间", openingText: "开舱时间", vgmCutoffText: "VGM 截止时间", portCutoffText: "截港时间", cutoffText: "截关时间", etbText: "预计靠港时间", customerReference: "客户参考号",
  active: "启用状态", name: "名称", code: "编号", origin: "起点", destination: "终点", viaPoints: "途经点", routeType: "路线类型", standardKilometers: "标准公里数", standardToll: "标准过路费", standardFuel: "标准油费", applicableVehicleTypes: "适用车型", applicableContainerTypes: "适用柜型",
  status: "状态", parseStatus: "解析状态", reviewStatus: "核验状态", confirmationStatus: "确认状态", paymentStatus: "付款状态", soNumber: "SO 编号", carrier: "船公司", vesselName: "船名", voyage: "航次", containerType: "柜型", containerNo: "实际柜号", internalCode: "内部柜号", quantity: "数量", scheduledAt: "计划时间", expectedLoadingAt: "预计装柜时间", etbAt: "预计靠港时间", source: "信息来源", note: "备注", customerId: "客户", factoryId: "工厂", loadingPlanId: "装柜计划", transportTaskId: "运输任务", vehicleNo: "车牌", plateNumber: "车牌", driverName: "司机", driverPhone: "联系电话", amount: "金额", currency: "币种", category: "费用类型", billNo: "结算单号", settlementMonth: "结算月份",
  siCutoffSource: "截关时间来源", forwarderSiCutoffSource: "货代截关时间来源", siCutoffEstimatedFromText: "截关预计时间文本", forwarderSiCutoffEstimatedFromText: "货代截关预计时间文本", reason: "变更原因",
};

function readableEnum(value: string) {
  return value.split("_").map(word => word === "SO" || word === "ETB" ? word : `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`).join(" ");
}

export function auditActionLabel(action: string) { return actionLabels[action] || readableEnum(action); }
export function auditEntityLabel(entityType: string) { return entityLabels[entityType] || entityType.replace(/([a-z])([A-Z])/g, "$1 $2"); }
export function auditFieldLabel(field: string) { return (fieldLabels[field] || `未映射字段（${field}）`).replace(/时间文本$/, "时间"); }
const fieldValueLabels: Record<string, string> = {
  MANUAL: "人工录入", SYSTEM_ESTIMATED: "系统推算", SO_LOAD_PORT_ETA_CUT_OFF: "SO 起运港截关规则推算",
  CONFIRMED: "已确认", PENDING_REVIEW: "待核验", PENDING: "待处理", PARSED: "已解析", VERIFIED: "已核验", REJECTED: "已驳回", CANCELLED: "已取消", COMPLETED: "已完成", ACTIVE: "启用", INACTIVE: "停用", DRAFT: "草稿", PAID: "已付款", UNPAID: "未付款",
};
export function auditFieldValue(value: string) { return fieldValueLabels[value] || value; }
