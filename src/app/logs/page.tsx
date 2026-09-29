import { prisma } from "@/lib/prisma";
import { auditActionLabel, auditEntityLabel } from "@/lib/audit";

function changeDetail(before: unknown, after: unknown) {
  if (!before && !after) return "—";
  return <details><summary>查看变更</summary>{before ? <p><small>变更前</small><code className="audit-json">{JSON.stringify(before)}</code></p> : null}{after ? <p><small>变更后</small><code className="audit-json">{JSON.stringify(after)}</code></p> : null}</details>;
}

export default async function Logs() {
  const logs = await prisma.operationLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return <>
    <h2>操作日志</h2>
    <p>显示最近 200 条记录。成员标签仅用于说明操作人，不影响系统功能权限；没有操作人的记录表示系统定时任务。</p>
    <table><thead><tr><th>时间</th><th>操作人</th><th>操作</th><th>对象</th><th>详情</th></tr></thead><tbody>{logs.length ? logs.map(log => <tr key={log.id}>
      <td>{log.createdAt.toLocaleString("zh-CN")}</td>
      <td>{log.actorName ? `${log.actorName}（${log.actorRole === "ADMIN" ? "负责人" : "成员"}）` : "系统任务"}</td>
      <td>{auditActionLabel(log.action)}</td>
      <td>{auditEntityLabel(log.entityType)}</td>
      <td>{changeDetail(log.before, log.after)}</td>
    </tr>) : <tr><td colSpan={5}>暂无操作日志。</td></tr>}</tbody></table>
  </>;
}
