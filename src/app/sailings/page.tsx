import { TABLE_EMPTY_MARKER } from "@/components/ui/table-placeholder";
import { UrlFilterBar } from "@/components/ui/url-filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { activeEtbRunStatuses } from "@/lib/etb-query-status";
import { prisma } from "@/lib/prisma";
import {
  chinaLocalDateTimeToDate,
  formatChinaDateTime,
  formatOperationalTimeText,
  resolveOpeningTime,
} from "@/lib/time";
import { SailingTable } from "./sailing-table";

type Search = { pageSize?: string; page?: string; q?: string; status?: string };

export default async function Sailings({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const input = await searchParams;
  const pageSize = [10, 20, 50, 100].includes(Number(input.pageSize))
    ? Number(input.pageSize)
    : 10;
  const query = input.q?.trim() || "";
  const status =
    input.status === "pending" || input.status === "synced"
      ? input.status
      : "all";
  const sailings = await prisma.sailing.findMany({
    where: { orders: { some: {} } },
    orderBy: [{ carrier: "asc" }, { id: "asc" }],
    include: {
      queryRuns: {
        where: { status: { in: [...activeEtbRunStatuses] } },
        select: { id: true },
        take: 1,
      },
      observations: {
        where: { status: "PENDING" },
        select: { id: true, etbAt: true, screenshotStorageKey: true },
        orderBy: [{ observedAt: "desc" }, { id: "desc" }],
        take: 1,
      },
      orders: {
        orderBy: [{ soNumber: "asc" }, { id: "asc" }],
        select: {
          id: true,
          soNumber: true,
          vesselName: true,
          voyage: true,
          etbText: true,
          etbNeedsReview: true,
          openingText: true,
          portCutoffText: true,
          cutoffText: true,
          siCutoffText: true,
        },
      },
    },
  });

  const now = Date.now();
  const terms = query.toLowerCase().split(/\s+/);
  const rows = sailings.flatMap((sailing) =>
    sailing.orders.flatMap((order) => {
      const searchable = [order.soNumber, order.vesselName, order.voyage]
        .join(" ")
        .toLowerCase();
      const pending = sailing.observations[0];
      const synced = Boolean(
        sailing.adoptedEtbAt &&
        !sailing.etbNeedsReview &&
        !order.etbNeedsReview &&
        !pending,
      );
      if (
        !terms.every((term) => searchable.includes(term)) ||
        (status !== "all" && (status === "synced") !== synced)
      )
        return [];

      const format = (value: string | null) =>
        value ? formatOperationalTimeText(value) : TABLE_EMPTY_MARKER;
      const cy = format(order.portCutoffText);
      const customs = format(order.cutoffText);
      const si = format(order.siCutoffText);
      const expired = [si, cy, customs].filter((value) => {
        const deadline = chinaLocalDateTimeToDate(value);
        return deadline && deadline.getTime() < now;
      });
      return [
        {
          id: order.id,
          so: order.soNumber,
          expired,
          pushedBack: Boolean(
            pending &&
            sailing.adoptedEtbAt &&
            pending.etbAt > sailing.adoptedEtbAt,
          ),
          vessel: order.vesselName,
          voyage: order.voyage,
          terminal: sailing.terminal,
          sailingId: sailing.id,
          queryActive: sailing.queryRuns.length > 0,
          synced,
          pendingId: pending?.id,
          evidenceHref: pending?.screenshotStorageKey
            ? `/api/evidence?key=${encodeURIComponent(pending.screenshotStorageKey)}`
            : undefined,
          pendingEtb: pending ? formatChinaDateTime(pending.etbAt) : undefined,
          etb: sailing.adoptedEtbAt
            ? formatChinaDateTime(sailing.adoptedEtbAt)
            : format(order.etbText),
          opening:
            resolveOpeningTime(order.openingText, order.portCutoffText)
              ?.value || TABLE_EMPTY_MARKER,
          cy,
          customs,
          si,
        },
      ];
    }),
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(input.page || "", 10) || 1),
  );
  const params = new URLSearchParams({
    q: query,
    status,
    pageSize: String(pageSize),
  });
  return (
    <>
      <PageHeader title="船期管理" />
      <SailingTable
        key={`${params}&page=${page}`}
        rows={rows.slice((page - 1) * pageSize, page * pageSize)}
        filter={
          <UrlFilterBar
            items={[
              {
                key: "q",
                type: "input",
                label: "搜索 SO 号、船名或航次",
                placeholder: "搜索 SO 号 / 船名 / 航次",
                applyOnBlur: true,
              },
              {
                key: "status",
                type: "select",
                label: "同步状态",
                placeholder: "全部状态",
                options: [
                  { value: "pending", label: "待核对" },
                  { value: "synced", label: "已核对" },
                ],
              },
            ]}
            initialValues={{ q: query, status: status === "all" ? "" : status }}
            fixedParams={{ pageSize: String(pageSize) }}
          />
        }
        pagination={
          <Pagination
            pageSize={pageSize}
            currentPage={page}
            totalPages={totalPages}
            total={rows.length}
            href={(current) => `/sailings?${params}&page=${current}`}
            label="船期分页"
          />
        }
      />
    </>
  );
}
