import { prisma } from "@/lib/prisma";
import { formatChinaDateTime } from "@/lib/time";
import { EtbHandoffButton } from "@/components/etb-handoff-button";
import { EtbUnmatchedMatchForm } from "@/components/etb-unmatched-match-form";

export default async function EtbRuns() {
  const [runs, sailings] = await Promise.all([prisma.etbQueryRun.findMany({
    include: { unmatchedResults: { where: { resolvedAt: null }, orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  }), prisma.sailing.findMany({ select: { id: true, terminal: true, carrier: true, vesselName: true, voyage: true } })]);
  return <>
    <h2>ETB 查询任务</h2>
    <p>盐田、蛇口计划于中国时间 10:00、16:00 查询。未配置来源、登录过期或机器人验证会转为人工接管；不会清空历史 ETB，也不会覆盖业务采用值。</p>
    <table><thead><tr><th>码头</th><th>来源</th><th>计划时间</th><th>任务状态</th><th>会话状态</th><th>结果</th><th>人工接管 / 失败原因</th><th>证据</th></tr></thead><tbody>
      {runs.length ? runs.map(run => <tr key={run.id}>
        <td>{run.terminal}</td><td>{run.source}</td><td>{formatChinaDateTime(run.scheduledFor)}</td>
        <td><span className="tag">{run.status}</span></td><td>{run.sessionState}</td><td>{run.resultCount}{run.unmatchedResults.length ? <><br/><small>待匹配 {run.unmatchedResults.length} 条</small></> : null}</td>
        <td>{run.status === "AWAITING_MANUAL" ? <><p>{run.handoffReason || run.errorMessage}</p>{run.unmatchedResults.length ? <ul>{run.unmatchedResults.map(item => <li key={item.id}>{item.carrier} / {item.vesselName} / {item.voyage} · {formatChinaDateTime(item.etbAt)}<EtbUnmatchedMatchForm runId={run.id} resultId={item.id} sailings={sailings.filter(sailing => sailing.terminal === run.terminal).map(sailing => ({ id: sailing.id, label: `${sailing.carrier} / ${sailing.vesselName} / ${sailing.voyage}` }))}/></li>)}</ul> : null}<EtbHandoffButton runId={run.id}/>{run.manualHandledAt && <small>已记录：{formatChinaDateTime(run.manualHandledAt)}</small>}</> : run.errorMessage || "—"}</td>
        <td>{run.screenshotStorageKey ? <a href={`/api/evidence?key=${encodeURIComponent(run.screenshotStorageKey)}`} target="_blank" rel="noreferrer">查看截图</a> : "—"}</td>
      </tr>) : <tr><td colSpan={8}>暂无 ETB 查询记录。</td></tr>}
    </tbody></table>
  </>;
}
