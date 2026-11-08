import type { Prisma } from "@prisma/client";
import { Download, FileText } from "lucide-react";
import { DeleteOrderButton } from "@/components/delete-order-button";
import { OrderStatusTag, ParseStatusTag } from "@/components/order-status-form";
import { ParsePendingButton } from "@/components/parse-pending-button";
import { OrdersFilter } from "@/components/orders-filter";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/prisma";
import { cutoffOptions, orderCutoffStatus, orderSearchConditions } from "@/lib/so-order-filters";
import { soReviewReasons } from "@/lib/so-review-task";
import { statusLabel, statusTone } from "@/lib/status-labels";
import { formatOperationalTimeText } from "@/lib/time";
import { OrderUploadActions, OrderUploadButton } from "./order-upload-actions";

const columns = [
  "SO 编号 / 提单号",
  "船公司 / 航次",
  "箱型箱量",
  "柜号",
  "合作客户",
  "截港时间",
  "流转状态",
  "操作",
];

const cell = "px-4 py-3 align-top";
const secondary = "mt-0.5 block text-xs text-slate-500";

type OrderExtraction = {
  containers?: { containerType?: string; quantity?: number }[];
  parseReview?: Parameters<typeof soReviewReasons>[0];
};

type Search = {
  pageSize?: string;
  review?: string;
  q?: string;
  status?: string;
  parseStatus?: string;
  customerId?: string;
  cutoff?: string;
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
  const pageSize = [10, 20, 50, 100].includes(Number(input.pageSize)) ? Number(input.pageSize) : 10;
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
  const cutoff = cutoffOptions.find(option => option.value === input.cutoff)?.value;
  const where: Prisma.SoOrderWhereInput = {
    parseStatus: { in: ["PARSED", "VERIFIED"] },
    ...(status ? { status } : {}),
    ...(parseStatus ? { parseStatus } : {}),
    ...(input.customerId ? { customerId: input.customerId } : {}),
    ...(q ? { OR: orderSearchConditions(q) } : {}),
  };
  const include = {
    customer: { select: { name: true } },
    containers: {
      where: { active: true },
      select: { containerType: true, containerNo: true, internalCode: true },
      orderBy: { internalCode: "asc" as const },
    },
    files: {
      orderBy: { version: "desc" as const },
      take: 1,
      select: { rawExtraction: true },
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
  const now = new Date();
  const filtered = found.filter(order => {
    if (cutoff && orderCutoffStatus(order.portCutoffText, now) !== cutoff) return false;
    const extraction = order.files[0]?.rawExtraction as OrderExtraction | undefined;
    return !reviewOnly || soReviewReasons(extraction?.parseReview).length > 0;
  });
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const orders = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const exportParams = new URLSearchParams();
  for (const key of ["q", "status", "parseStatus", "customerId", "cutoff"] as const)
    if (input[key]) exportParams.set(key, input[key]!);

  const content = (
    <>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-lg font-semibold text-slate-900">
            {reviewOnly ? "待复核 SO" : "SO 订单"}
          </h1>
          <p className="m-0 mt-0.5 text-xs text-slate-400">
            {reviewOnly
              ? <><a href="/orders">查看全部 SO</a> · 仅显示解析有冲突或缺少核心字段的订单。</>
              : "实时管理订舱单流转状态"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/api/orders/export?${exportParams}`}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-solid border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 no-underline hover:bg-slate-50"
          >
            <Download size={16} aria-hidden="true" />
            导出 CSV
          </a>
          {!reviewOnly && <OrderUploadButton />}
        </div>
      </header>

      <section aria-label="订单列表" className="min-w-0 rounded-lg border border-solid border-slate-200/90 bg-white shadow-xs">
        <div className="border-0 border-b border-solid border-slate-100 p-4">
          <OrdersFilter
            q={q}
            status={status}
            cutoff={cutoff}
            customerId={input.customerId}
            customers={customers}
            reviewOnly={reviewOnly}
          />
        </div>

        <div className="overflow-x-auto [container-type:inline-size]">
          <table aria-label={reviewOnly ? "待复核 SO" : "SO 订单"} className="w-full min-w-[960px] border-collapse text-[13px] text-slate-700">
            <thead className="bg-slate-50">
              <tr>
                {columns.map(column => (
                  <th key={column} scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const extraction = order.files[0]?.rawExtraction as OrderExtraction | undefined;
                const review = soReviewReasons(extraction?.parseReview);
                const counts = new Map<string, number>();
                for (const { containerType } of order.containers) {
                  counts.set(containerType, (counts.get(containerType) ?? 0) + 1);
                }
                const confirmed = [...counts].map(([type, quantity]) => `${quantity} × ${type}`);
                const parsed = extraction?.containers
                  ?.filter(item => item.containerType && item.quantity)
                  .map(item => `${item.quantity} × ${item.containerType}`);
                const quantities = confirmed.length ? confirmed : parsed;
                const cutoffTime = order.portCutoffText && formatOperationalTimeText(order.portCutoffText);
                return (
                  <tr key={order.id} className="border-0 border-b border-solid border-slate-100 last:border-b-0 hover:bg-slate-50/70">
                    <td className={cell}>
                      <a className="font-medium text-blue-700 no-underline hover:underline" href={`/orders/${order.id}`}>
                        {order.soNumber}
                      </a>
                      {review.length > 0 && <span className="mt-1 block text-xs text-amber-700">需核对：{review.join("；")}</span>}
                    </td>
                    <td className={cell}>
                      {order.carrier || "待核对"}
                      <span className={secondary}>{[order.vesselName, order.voyage].filter(Boolean).join(" / ") || "待核对"}</span>
                    </td>
                    <td className={cell}>{quantities?.join("；") || "待核对"}</td>
                    <td className={cell}>
                      {order.containers.length
                        ? order.containers.map(container => (
                            <span key={container.internalCode} className="block whitespace-nowrap">
                              {container.containerNo || container.internalCode}
                            </span>
                          ))
                        : "待补充"}
                    </td>
                    <td className={cell}>{order.customer?.name || "待匹配客户"}</td>
                    <td className={`${cell} whitespace-nowrap`}>{cutoffTime || "待核对"}</td>
                    <td className={cell}>
                      <div className="flex flex-wrap items-center gap-1">
                        <OrderStatusTag orderId={order.id} status={order.status} />
                        {order.parseStatus === "PARSED" || order.parseStatus === "VERIFIED"
                          ? <ParseStatusTag orderId={order.id} status={order.parseStatus} />
                          : <StatusBadge tone={statusTone(order.parseStatus)}>{statusLabel(order.parseStatus)}</StatusBadge>}
                      </div>
                    </td>
                    <td className={cell}>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {order.parseStatus === "PARSED" && (
                          <ParsePendingButton orderId={order.id} reparse compact variant="secondary" size="small" />
                        )}
                        <DeleteOrderButton orderId={order.id} size="small" />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="sticky left-0 box-border flex min-h-[420px] w-[100cqw] flex-col items-center justify-center px-4 py-8 text-center">
                      <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                        <FileText size={24} strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <p className="m-0 text-sm font-medium text-slate-700">
                        {reviewOnly ? "暂无待复核 SO" : "未找到符合条件的订单"}
                      </p>
                      <p className="m-0 mt-1 text-xs text-slate-400">
                        {reviewOnly ? "可尝试清空筛选条件，查看全部待复核订单。" : "您可以尝试清空筛选条件，或直接上传新单据"}
                      </p>
                      {!reviewOnly && <OrderUploadButton compact />}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {total > pageSize && (
          <div className="border-0 border-t border-solid border-slate-100 px-4">
            <Pagination
              pageSize={pageSize}
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              href={page => href(input, page)}
              label="订单分页"
            />
          </div>
        )}
      </section>
    </>
  );

  return reviewOnly ? content : <OrderUploadActions>{content}</OrderUploadActions>;
}
