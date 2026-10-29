import { prisma } from "@/lib/prisma";
import { BulkEtbQueryForm } from "@/components/bulk-etb-query-form";
import { formatChinaDateTime, formatOperationalTimeText, resolveOpeningTime } from "@/lib/time";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RecordCard, RecordCardField, RecordCardFields, RecordCardList } from "@/components/ui/record-card";
import { EtbConfirmationTag } from "@/components/etb-confirmation-tag";
import { Pagination } from "@/components/ui/list";
import styles from "./page.module.css";

const pageSize = 5;
type Search = { page?: string };

export default async function Sailings({ searchParams }: { searchParams: Promise<Search> }) {
  const input = await searchParams;
  const requestedPage = Math.max(1, Number(input.page) || 1);
  const found = await prisma.sailing.findMany({ where: { orders: { some: {} } }, include: { _count: { select: { orders: true, observations: true } }, observations: { select: { id: true, observedAt: true, status: true }, orderBy: { observedAt: "desc" } }, orders: { select: { id: true, soNumber: true, carrier: true, vesselName: true, voyage: true, loadPort: true, etbText: true, openingText: true, siCutoffText: true, portCutoffText: true }, orderBy: { soNumber: "asc" } } }, orderBy: { carrier: "asc" } });
  const totalPages = Math.max(1, Math.ceil(found.length / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);
  const sailings = found.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const etbOrders = sailings.filter(sailing => sailing.terminal !== "大铲湾").flatMap(sailing => sailing.orders.map(order => ({ id: order.id, label: `${order.soNumber} · ${order.carrier} · ${order.vesselName || "船名待核对"}/${order.voyage || "航次待核对"}` })));
  const hasDachanBaySailing = sailings.some(sailing => sailing.terminal === "大铲湾");

  return <>
    <PageHeader title="船期管理" />
    <BulkEtbQueryForm orders={etbOrders} />
    {hasDachanBaySailing ? <p className={styles.resultSummary}>大铲湾船期不自动查询 ETB；如客户通知变更，请进入对应船期后人工录入并确认。</p> : null}
    <p className={styles.resultSummary}>共 <b>{found.length}</b> 条结果，第 {currentPage} / {totalPages} 页。</p>
    <RecordCardList className={styles.list} density="compact">{sailings.length ? sailings.map(s => <RecordCard density="compact" key={s.id} className={[styles.card, s.etbNeedsReview ? styles.cardReview : undefined].filter(Boolean).join(" ")}>
      {s.orders.map((order, index) => <section key={order.id} className={styles.orderDetails}>
        <div className={styles.orderHeader}><div className={styles.orderTopLeft}><div className={styles.orderIdentity}><span>SO 编号</span><a href={`/orders/${order.id}`}>{order.soNumber}</a></div>{index === 0 ? <small className={styles.orderMeta}>关联 {s._count.orders} 个 SO · 共记录 {s._count.observations} 次时间更新 · 最后成功更新时间：{s.observations[0] ? formatChinaDateTime(s.observations[0].observedAt) : "尚无成功更新记录"}</small> : null}</div>{index === 0 ? <EtbConfirmationTag sailingId={s.id} pendingObservationId={s.observations.find(observation => observation.status === "PENDING")?.id} status={s.etbNeedsReview ? "PENDING" : s.adoptedEtbAt ? "CONFIRMED" : "WAITING"} /> : null}</div>
        <RecordCardFields density="compact" columns={4} className={styles.orderFields}>
          <RecordCardField density="compact"><span className={styles.label}>船名 / 航次</span><b>{order.vesselName || "待核对"} / {order.voyage || "待核对"}</b></RecordCardField>
          <RecordCardField density="compact"><span className={styles.label}>码头 / 装货港</span><b>{s.terminal} / {order.loadPort || "待补充"}</b></RecordCardField>
          <RecordCardField density="compact"><span className={styles.label}>预计靠泊时间（ETB）</span><b>{order.etbText ? formatOperationalTimeText(order.etbText) : "待核对"}</b></RecordCardField>
          <RecordCardField density="compact"><span className={styles.label}>开仓时间</span><b>{resolveOpeningTime(order.openingText, order.portCutoffText)?.value || "待核对"}</b></RecordCardField>
          <RecordCardField density="compact"><span className={styles.label}>补料时间</span><b>{order.siCutoffText ? formatOperationalTimeText(order.siCutoffText) : "待核对"}</b></RecordCardField>
          <RecordCardField density="compact"><span className={styles.label}>码头截关时间（CY）</span><b>{order.portCutoffText ? formatOperationalTimeText(order.portCutoffText) : "待核对"}</b></RecordCardField>
        </RecordCardFields>
      </section>)}
    </RecordCard>) : <EmptyState title="暂无自动归集的船期">请先完成 SO 核对；船名、航次和装货港齐全后，系统会自动创建或关联船期。</EmptyState>}</RecordCardList>
    <Pagination currentPage={currentPage} totalPages={totalPages} href={page => `/sailings?page=${page}`} label="船期分页" />
  </>;
}
