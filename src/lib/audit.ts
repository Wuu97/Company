export type AuditActor = { id: string; name: string; role: "ADMIN" | "OPERATOR" };
export function actorFields(actor?: AuditActor) { return actor ? { actorUserId: actor.id, actorName: actor.name, actorRole: actor.role } : {}; }

const actionLabels: Record<string, string> = {
  SO_FILE_UPLOADED: "上传 SO 文件", SO_FILE_VERSION_UPLOADED: "上传 SO 新版本", SO_REVIEWED: "人工核对 SO", SO_STATUS_CHANGED: "变更 SO 状态", SO_VERSION_CHANGE_APPLIED: "应用 SO 版本差异", SO_DELETED: "删除 SO", SO_FILE_DELETE_PENDING: "SO 文件待人工删除", SO_CONTAINERS_ADJUSTED: "调整 SO 柜量",
  CONTAINER_CREATED: "创建内部柜子", CUSTOMER_CREATED: "创建客户", FACTORY_CREATED: "创建工厂",
  CUSTOMER_CONFIRMATION_CREATED: "记录客户上柜确认", CUSTOMER_CONFIRMATION_CANCELLED: "取消客户确认", CUSTOMER_CONTACT_TASK_RESOLVED: "处理客户联系待办",
  LOADING_PLAN_CREATED: "创建装柜计划", LOADING_PLAN_ADJUSTED: "调整装柜计划", LOADING_PLAN_CANCELLED: "取消装柜计划",
  TRANSPORT_TASK_CREATED: "创建运输任务", TRANSPORT_TASK_STATUS_CHANGED: "更新运输状态", TRANSPORT_ETB_IMPACT_RESOLVED: "处理运输 ETB 影响", ETB_IMPACTED_DISPATCHED_TRANSPORT: "发现已派车 ETB 影响",
  SAILING_CREATED: "创建船期", ETB_OBSERVED: "录入 ETB 观测", ETB_CHANGE_DETECTED: "发现 ETB 变化", ETB_ADOPTED: "采用 ETB 业务时间", ETB_QUERY_MANUAL_HANDOFF: "ETB 查询转人工处理", ETB_SOURCE_CREDENTIAL_UPDATED: "更新 ETB 数据源账号", ETB_CREDENTIAL_TEST_QUEUED: "发起 ETB 账号验证",
  USER_CREATED: "创建家庭成员账号", USER_ENABLED: "启用家庭成员账号", USER_DISABLED: "停用家庭成员账号", USER_PASSWORD_RESET: "重置成员密码", USER_CHANGED_OWN_PASSWORD: "修改本人密码",
  SO_PARSE_JOB_COMPLETED: "执行 SO 解析任务",
};

const entityLabels: Record<string, string> = {
  SoOrder: "SO 订单", SoFileVersion: "SO 文件", ContainerUnit: "内部柜子", Customer: "客户", Factory: "工厂", CustomerConfirmation: "客户确认", CustomerContactTask: "客户联系待办", LoadingPlan: "装柜计划", TransportTask: "运输任务", Sailing: "船期", EtbQueryRun: "ETB 查询任务", DataSourceCredential: "ETB 数据源账号", EtbCredentialTestRun: "ETB 账号验证", AppUser: "家庭成员",
};

export function auditActionLabel(action: string) { return actionLabels[action] || action; }
export function auditEntityLabel(entityType: string) { return entityLabels[entityType] || entityType; }
