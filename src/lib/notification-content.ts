export function etbNotificationBody(reason: string | null | undefined, manual = false): string {
  const text = reason || "";
  if (/验证码|人机验证|机器人|安全验证/.test(text)) return "港口网站需要完成安全验证。请打开查询记录，按提示完成验证后重试。";
  if (/会话失效|会话过期|重新登录|未登录|登录已失效/.test(text)) return "港口网站的登录已失效。请重新登录港口平台后再查询。";
  if (/Executable doesn't exist|browserType\.launch|浏览器.*启动|Worker/.test(text)) return "查询服务暂时不可用。请稍后重试，若仍失败，请联系系统管理员。";
  if (/locator|Timeout|超时|iframe|页面|选择器|筛选|条件/.test(text)) return "港口查询页面暂时无法完成操作。请稍后重试，若仍失败，请联系系统管理员。";
  if (/未找到|没有匹配|无法匹配|候选|重复|大小写|未能确定/.test(text)) return "未能确定与该船期对应的查询结果。请核对船名、航次及港口后重试。";
  return manual
    ? "该船期的自动查询需要人工处理。请查看查询记录，按提示处理后重试。"
    : "本次靠泊时间查询未完成。请稍后重试，若仍失败，请联系系统管理员。";
}

export function notificationContent(input: { kind: string; title: string; body: string }) {
  if (["ETB_QUERY_FAILED", "ETB_MANUAL_HANDOFF", "ETB_MANUAL_HANDOFF_OVERDUE"].includes(input.kind)) {
    return {
      title: input.title.replace("ETB 查询", "靠泊时间查询").replace("ETB 人工接管超时", "靠泊时间查询待处理").replace("需要人工接管", "需要人工处理"),
      body: etbNotificationBody(input.body, input.kind !== "ETB_QUERY_FAILED"),
    };
  }
  if (/locator\.|Call log:|Traceback|PrismaClient|\bat .+\.(?:ts|js):\d+|Executable doesn't exist/.test(input.body)) {
    return { title: input.title, body: "本次操作未完成。请查看相关业务并重试，若仍失败，请联系系统管理员。" };
  }
  return { title: input.title, body: input.body };
}
