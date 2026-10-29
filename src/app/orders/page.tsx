import { Prisma } from "@prisma/client";
import businessStyles from "@/components/business.module.css";
import { DeleteOrderButton } from "@/components/delete-order-button";
import { OrderStatusTag, ParseStatusTag } from "@/components/order-status-form";
import { ParsePendingButton } from "@/components/parse-pending-button";
import { OrdersFilter } from "@/components/orders-filter";
import { SoUploadForm } from "@/components/so-upload-form";
import { prisma } from "@/lib/prisma";
import { soReviewReasons } from "@/lib/so-review-task";
import { statusLabel, statusTone } from "@/lib/status-labels";
import {
  formatChinaDateTime,
  formatOperationalTimeText,
  resolveOpeningTime,
} from "@/lib/time";
import styles from "./orders-toolbar.module.css";
import orderStyles from "./orders.module.css";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/list";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

const pageSize = 5;
type Search = {
  review?: string;
  q?: string;
  status?: string;
  parseStatus?: string;
  customerId?: string;
  page?: string;
};
const orderStatuses = [
  "PENDING_REVIEW",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;
const parseStatuses = [
  "PENDING",
  "PROCESSING",
  "PARSED",
  "FAILED",
  "VERIFIED",
] as const;
const href = (input: Search, page: number) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input))
    if (value && key !== "page") params.set(key, value);
  params.set("page", String(page));
  return `/orders?${params}`;
};

export default async function Orders({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const input = await searchParams;
  const reviewOnly = input.review === "1";
  const q = input.q?.trim() || "";
  const page = Math.max(1, Number(input.page) || 1);
  const status = orderStatuses.includes(
    input.status as (typeof orderStatuses)[number],
  )
    ? (input.status as (typeof orderStatuses)[number])
    : undefined;
  const parseStatus = parseStatuses.includes(
    input.parseStatus as (typeof parseStatuses)[number],
  )
    ? (input.parseStatus as (typeof parseStatuses)[number])
    : undefined;
  const where: Prisma.SoOrderWhereInput = {
    parseStatus: { in: ["PARSED", "VERIFIED"] },
    ...(status ? { status } : {}),
    ...(parseStatus ? { parseStatus } : {}),
    ...(input.customerId ? { customerId: input.customerId } : {}),
    ...(q
      ? {
          OR: [
            { soNumber: { contains: q, mode: "insensitive" } },
            { carrier: { contains: q, mode: "insensitive" } },
            { vesselName: { contains: q, mode: "insensitive" } },
            { voyage: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const include = {
    customer: true,
    containers: true,
    sailing: { select: { terminal: true } },
    files: {
      orderBy: { version: "desc" as const },
      take: 1,
      select: { rawExtraction: true, createdAt: true },
    },
  };
  const [customers, found] = await Promise.all([
    prisma.customer.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.soOrder.findMany({
      where: reviewOnly ? { ...where, parseStatus: "PARSED" } : where,
      include,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const filtered = reviewOnly
    ? found.filter(
        (order) =>
          soReviewReasons(
            (
              order.files[0]?.rawExtraction as
                | {
                    parseReview?: {
                      missingCoreFields?: string[];
                      conflictingFields?: string[];
                      needsReview?: boolean;
                    };
                  }
                | undefined
            )?.parseReview,
          ).length > 0,
      )
    : found;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const orders = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const exportParams = new URLSearchParams();
  for (const key of ["q", "status", "parseStatus", "customerId"] as const)
    if (input[key]) exportParams.set(key, input[key]!);
  const filter = (
    <OrdersFilter
      q={q}
      status={status}
      parseStatus={parseStatus}
      customerId={input.customerId}
      customers={customers}
      reviewOnly={reviewOnly}
      exportHref={`/api/orders/export?${exportParams}`}
      className={styles.filter}
    />
  );

  return (
    <>
      <PageHeader
        title={reviewOnly ? "待复核 SO" : "SO 订单"}
        description={reviewOnly ? <><a href="/orders">查看全部 SO</a> · 仅显示解析有冲突或缺少核心字段的订单。</> : undefined}
      />
      {reviewOnly ? (
        <>
          {filter}
        </>
      ) : (
        <div className={styles.toolbar}>
          <SoUploadForm className={styles.upload} />
          {filter}
        </div>
      )}
      <p className={[businessStyles.muted, orderStyles.resultSummary].join(" ")}>
        共 <b>{total}</b> 条结果，第 {currentPage} / {totalPages} 页。
      </p>
      {orders.length ? (
        <div className={orderStyles.list}>
          {orders.map((order) => {
            const rawExtraction = order.files[0]?.rawExtraction as
              | {
                  containers?: Array<{
                    containerType?: string;
                    quantity?: number;
                  }>;
                  parseReview?: {
                    missingCoreFields?: string[];
                    conflictingFields?: string[];
                    needsReview?: boolean;
                  };
                }
              | undefined;
            const confirmedContainers = Object.entries(
              order.containers.reduce<Record<string, number>>(
                (all, c) => ({
                  ...all,
                  [c.containerType]: (all[c.containerType] || 0) + 1,
                }),
                {},
              ),
            )
              .map(([type, count]) => `${count} × ${type}`)
              .join("；");
            const parsedContainers = (rawExtraction?.containers ?? [])
              .filter((item) => item.containerType && item.quantity)
              .map((item) => `${item.quantity} × ${item.containerType}`)
              .join("；");
            const containers =
              confirmedContainers || parsedContainers || "待核对";
            const shippingLineSi =
              order.siCutoffSource === "SYSTEM_ESTIMATED"
                ? <>{formatOperationalTimeText(order.siCutoffText || "待人工核对")}<span className={orderStyles.estimated}>系统推算</span></>
                : order.siCutoffSource === "NEEDS_REVIEW"
                  ? "待人工核对"
                  : order.siCutoffText
                    ? formatOperationalTimeText(order.siCutoffText)
                    : "待人工核对";
            const review = soReviewReasons(rawExtraction?.parseReview);
            const opening = resolveOpeningTime(order.openingText, order.portCutoffText);
            return (
              <article
                className={`${orderStyles.card}${review.length ? ` ${orderStyles.cardReview}` : ""}`}
                key={order.id}
              >
                <div className={orderStyles.header}>
                  <div className={orderStyles.identity}>
                    <span>SO 编号</span>
                    <a href={`/orders/${order.id}`}>{order.soNumber}</a>
                    <small>
                      {order.customer?.name || "待匹配客户"} ·
                      {order.files[0]?.createdAt
                        ? formatChinaDateTime(order.files[0].createdAt)
                        : "记录缺失"}
                    </small>
                  </div>
                  <div className={orderStyles.tags}>
                    {["PARSED", "VERIFIED"].includes(order.parseStatus) ? <ParseStatusTag orderId={order.id} status={order.parseStatus as "PARSED" | "VERIFIED"} /> : <StatusBadge tone={statusTone(order.parseStatus)}>{statusLabel(order.parseStatus)}</StatusBadge>}
                    <OrderStatusTag orderId={order.id} status={order.status} />
                    {order.parseStatus === "PARSED" ? <ParsePendingButton orderId={order.id} reparse compact variant="secondary" size="small" className={orderStyles.tagAction} /> : null}
                    <DeleteOrderButton orderId={order.id} size="small" className={`${orderStyles.tagAction} ${orderStyles.tagActionDanger}`} />
                  </div>
                </div>
                {review.length ? (
                  <p className={orderStyles.review}>
                    <b>需要核对：</b>
                    {review.join("；")}
                  </p>
                ) : null}
                <div className={orderStyles.details}>
                  <div>
                    <span>船名 / 航次</span>
                    <b>
                      {order.vesselName
                        ? `${order.vesselName} / ${order.voyage || "待补充"}`
                        : "待核对"}
                    </b>
                  </div>
                  <div>
                    <span>柜量</span>
                    <b>{containers}</b>
                  </div>
                  <div>
                    <span>开仓时间</span>
                    <b>{opening?.value || "待核对"}{opening?.source === "SYSTEM_ESTIMATED" && <span className={orderStyles.estimated}>系统推算</span>}</b>
                  </div>
                  <div>
                    <span>预计开船时间（ETD）</span>
                    <b>
                      {order.etdText
                        ? formatOperationalTimeText(order.etdText)
                        : "待核对"}
                    </b>
                  </div>
                  <div>
                    <span>补料时间</span>
                    <b>{shippingLineSi}</b>
                  </div>
                  <div>
                    <span>码头截关时间（CY）</span>
                    <b>
                      {order.portCutoffText
                        ? formatOperationalTimeText(order.portCutoffText)
                        : "待核对"}
                    </b>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState title={reviewOnly ? "暂无待复核 SO" : "未找到符合条件的订单"}>{reviewOnly ? "当前没有识别冲突或缺少核心字段的订单。" : "可尝试调整关键词或筛选条件。"}</EmptyState>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} href={page => href(input, page)} label="订单分页"/>
    </>
  );
}
