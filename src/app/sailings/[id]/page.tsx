import { notFound } from "next/navigation";
import businessStyles from "@/components/business.module.css";
import { prisma } from "@/lib/prisma";
import { AdoptEtbButton, EtbObservationForm } from "@/components/sailing-forms";
import { formatChinaDateTime } from "@/lib/time";
import { statusLabel, statusTone } from "@/lib/status-labels";
import { RequestEtbQueryButton } from "@/components/request-etb-query-button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import styles from "./page.module.css";

function evidenceUrl(key: string) { return `/api/evidence?key=${encodeURIComponent(key)}`; }
function timeBasis(source?: string | null) { return ({ YANTIAN_CONTROLLED_BROWSER: "盐田码头信息", SHEKOU_CONTROLLED_BROWSER: "蛇口码头信息", MANUAL: "人工核对", VERIFIED_UNAMBIGUOUS_SO: "SO 已确认船期" } as Record<string, string>)[source || ""] || "已核对船期信息"; }

export default async function SailingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sailing = await prisma.sailing.findUnique({ where: { id }, include: { orders: { select: { id: true, soNumber: true, etbNeedsReview: true } }, observations: { orderBy: { observedAt: "desc" } } } });
  if (!sailing) notFound();
  return <>
    <PageHeader title={<>船期：{sailing.vesselName} / {sailing.voyage}</>} />
    <section className={styles.summary}><div><span>码头</span><b>{sailing.terminal}</b></div><div><span>装货港</span><b>{sailing.loadPort || "待补充"}</b></div><div><span>船公司</span><b>{sailing.carrier}</b></div><div><span>当前采用的靠港时间</span><b>{sailing.adoptedEtbAt ? formatChinaDateTime(sailing.adoptedEtbAt) : "尚未确认"}</b>{sailing.adoptedEtbSource && <small>依据：{timeBasis(sailing.adoptedEtbSource)}</small>}</div><div><span>新时间待确认</span><b>{sailing.pendingEtbAt ? formatChinaDateTime(sailing.pendingEtbAt) : "无"}</b></div></section>
    <EtbObservationForm sailingId={id}/>
    <section><h3>靠港时间更新记录</h3><p className={businessStyles["muted"]}>确认某条时间后，它会成为当前采用的业务时间；其他记录保留供核对。</p>{sailing.observations.length ? <div className={styles.observationList}>{sailing.observations.map(o => <article className={`${styles.observationCard}${o.status === "PENDING" ? ` ${styles.pending}` : ""}`} key={o.id}><div className={styles.observationHeader}><div><span>预计靠港时间</span><b>{formatChinaDateTime(o.etbAt)}</b></div><StatusBadge tone={statusTone(o.status)}>{statusLabel(o.status)}</StatusBadge></div><div className={styles.observationDetails}><div><span>时间依据</span>{o.sourceUrl ? <a href={o.sourceUrl} target="_blank" rel="noreferrer">{timeBasis(o.source)}</a> : <b>{timeBasis(o.source)}</b>}</div><div><span>更新时间</span><b>{formatChinaDateTime(o.observedAt)}</b></div><div><span>核对备注</span><b>{o.reviewNote || "尚未填写"}</b></div></div><div className={styles.observationFooter}>{o.screenshotStorageKey ? <ButtonLink variant="secondary" size="toolbar" href={evidenceUrl(o.screenshotStorageKey)} target="_blank" rel="noopener noreferrer">查看核对依据</ButtonLink> : <span>暂未附核对依据</span>}{o.status === "PENDING" && <AdoptEtbButton url={`/api/sailings/${id}/observations/${o.id}/adopt`}/>}</div></article>)}</div> : <EmptyState title="尚未记录预计靠港时间">可在上方录入船公司、码头或人工确认的最新时间。</EmptyState>}</section>
    <section><h3>关联订单</h3>{sailing.orders.length ? <div className={businessStyles["sailing-order-actions"]}>{sailing.orders.map(o => <div key={o.id}><a href={`/orders/${o.id}`}>{o.soNumber}</a>{o.etbNeedsReview && " · 靠港时间待确认"}<RequestEtbQueryButton orderId={o.id} enabled={sailing.terminal !== "大铲湾"} reason="大铲湾不自动查询 ETB；请按客户通知人工录入。"/></div>)}</div> : <p>暂无关联 SO。</p>}</section>
  </>;
}
