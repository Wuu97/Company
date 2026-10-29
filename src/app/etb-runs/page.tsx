import { prisma } from "@/lib/prisma";
import { formatChinaDateTime } from "@/lib/time";
import { EtbHandoffButton } from "@/components/etb-handoff-button";
import { EtbUnmatchedMatchForm } from "@/components/etb-unmatched-match-form";
import { statusLabel, statusTone } from "@/lib/status-labels";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { RecordCard, RecordCardField, RecordCardFields, RecordCardHeader, RecordCardList } from "@/components/ui/record-card";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import styles from "./page.module.css";

function sourceLabel(source: string) { return ({ YANTIAN_CONTROLLED_BROWSER: "盐田码头信息", SHEKOU_CONTROLLED_BROWSER: "蛇口码头信息" } as Record<string, string>)[source] || "船期更新信息"; }

export default async function EtbRuns() {
  const [runs, sailings] = await Promise.all([prisma.etbQueryRun.findMany({
    include: { unmatchedResults: { where: { resolvedAt: null }, orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  }), prisma.sailing.findMany({ select: { id: true, terminal: true, carrier: true, vesselName: true, voyage: true } })]);
  return <>
    <PageHeader title="船期更新记录" description="系统会定时更新盐田、蛇口的预计靠港时间。需要人工协助的记录会醒目标出，已确认的业务时间不会被自动改动。" />
    <RecordCardList className={styles.list} density="compact">{runs.length ? runs.map(run => <RecordCard density="compact" className={run.status === "AWAITING_MANUAL" ? styles.attention : undefined} key={run.id}>
      <RecordCardHeader density="compact" className={styles.header}><div><span>码头 / 时间依据</span><b>{run.terminal} · {sourceLabel(run.source)}</b></div><StatusBadge tone={statusTone(run.status)}>{statusLabel(run.status)}</StatusBadge></RecordCardHeader>
      <RecordCardFields density="compact" columns={3} className={styles.summary}><RecordCardField density="compact"><span>计划更新时间</span><b>{formatChinaDateTime(run.scheduledFor)}</b></RecordCardField><RecordCardField density="compact"><span>已获得时间</span><b>{run.resultCount} 条</b></RecordCardField><RecordCardField density="compact"><span>待关联船期</span><b>{run.unmatchedResults.length} 条</b></RecordCardField></RecordCardFields>
      {run.status === "AWAITING_MANUAL" ? <div className={styles.help}><p><b>需要人工协助</b>{run.handoffReason || run.errorMessage ? `：${run.handoffReason || run.errorMessage}` : "。请补充处理结果。"}</p>{run.unmatchedResults.length ? <div className={styles.matches}>{run.unmatchedResults.map(item => <div key={item.id}><b>{item.carrier} / {item.vesselName} / {item.voyage}</b><span>预计靠港：{formatChinaDateTime(item.etbAt)}</span><EtbUnmatchedMatchForm runId={run.id} resultId={item.id} sailings={sailings.filter(sailing => sailing.terminal === run.terminal).map(sailing => ({ id: sailing.id, label: `${sailing.carrier} / ${sailing.vesselName} / ${sailing.voyage}` }))}/></div>)}</div> : null}<EtbHandoffButton runId={run.id}/>{run.manualHandledAt && <small>已记录处理：{formatChinaDateTime(run.manualHandledAt)}</small>}</div> : <p className={styles.result}>{run.errorMessage || "本次更新已完成，无需人工处理。"}</p>}
      {run.screenshotStorageKey && <ButtonLink variant="secondary" size="toolbar" href={`/api/evidence?key=${encodeURIComponent(run.screenshotStorageKey)}`} target="_blank" rel="noopener noreferrer">查看更新依据</ButtonLink>}
    </RecordCard>) : <EmptyState title="暂无船期更新记录">后续的更新时间会显示在这里。</EmptyState>}</RecordCardList>
  </>;
}
