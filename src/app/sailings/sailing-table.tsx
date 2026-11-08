"use client";

import { TABLE_EMPTY_MARKER } from "@/components/ui/table-placeholder";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { PageContainer } from "@/components/ui/page-container";
import { CheckboxField } from "@/components/ui/form-controls";
import { ResultSummary } from "@/components/ui/list";
import { StatusTag } from "@/components/ui/status-tag";
import styles from "./page.module.css";

type Row = {
  id: string;
  so: string;
  expired: string[];
  pushedBack: boolean;
  vessel: string | null;
  voyage: string | null;
  terminal: string;
  sailingId: string;
  queryActive: boolean;
  synced: boolean;
  pendingId?: string;
  evidenceHref?: string;
  pendingEtb?: string;
  etb: string;
  opening: string;
  cy: string;
  customs: string;
  si: string;
};

const canQuery = (row: Row) => ["盐田", "蛇口"].includes(row.terminal);
export function SailingTable({
  rows,
  filter,
  pagination,
}: {
  rows: Row[];
  filter: ReactNode;
  pagination: ReactNode;
}) {
  const router = useRouter();
  const [selection, setSelection] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [review, setReview] = useState<Row[]>([]);
  const selected = rows.filter((row) => selection.includes(row.id));
  const [confirmPage, setConfirmPage] = useState(false);
  const updateScope = selected.length ? selected : rows;
  const queryable = updateScope.filter(canQuery);
  const updateDisabled =
    busy || queryable.length === 0 || queryable.length > 50;
  const all = rows.length > 0 && selected.length === rows.length;

  const hasActiveQuery = rows.some((row) => row.queryActive);
  useEffect(() => {
    if (!hasActiveQuery || busy || confirmPage || review.length) return;
    const timer = window.setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        !document.activeElement?.closest('form[role="search"]') &&
        !document.querySelector("[data-select-portal]")
      ) {
        router.refresh();
      }
    }, 10_000);
    return () => window.clearInterval(timer);
  }, [hasActiveQuery, busy, confirmPage, review.length, router]);

  async function query(targets: Row[]) {
    setConfirmPage(false);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/orders/etb-query/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: targets.map((row) => row.id) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "安排查询失败");
      const reasons = [
        ...new Set<string>(
          result.skipped.map((item: { reason: string }) => item.reason),
        ),
      ];
      const summary = result.queuedRunCount
        ? `已安排 ${result.queuedRunCount} 个船期查询，涉及 ${result.queuedOrderCount} 个 SO。`
        : "";
      setMessage(summary + reasons.join("；") || "没有可安排的船期查询");
      setSelection([]);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "安排查询失败");
    } finally {
      setBusy(false);
    }
  }

  function openReview(targets: Row[]) {
    setReview([
      ...new Map(
        targets
          .filter((row) => row.pendingId)
          .map((row) => [row.sailingId, row]),
      ).values(),
    ]);
  }

  async function confirmReview() {
    setBusy(true);
    setMessage("");
    const failures: string[] = [];
    for (const row of review) {
      try {
        const response = await fetch(
          `/api/sailings/${row.sailingId}/observations/${row.pendingId}/adopt`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}",
          },
        );
        if (!response.ok)
          throw new Error((await response.json()).error || "确认失败");
      } catch (error) {
        failures.push(
          `${row.so}：${error instanceof Error ? error.message : "确认失败"}`,
        );
      }
    }
    setMessage(
      `已确认 ${review.length - failures.length} 个船期。${failures.join("；")}`,
    );
    setReview([]);
    setSelection([]);
    router.refresh();
    setBusy(false);
  }

  const columns: DataTableColumn<Row>[] = [
    {
      key: "selection",
      width: 48,
      align: "center",
      title: (
        <CheckboxField
          aria-label="全选本页"
          disabled={!rows.length || busy}
          checked={all}
          indeterminate={selected.length > 0 && !all}
          onChange={(event) =>
            setSelection(event.target.checked ? rows.map((row) => row.id) : [])
          }
        />
      ),
      render: (_, row) => (
        <CheckboxField
          aria-label={`选择 ${row.so}`}
          disabled={busy}
          checked={selection.includes(row.id)}
          onChange={(event) => {
            const checked = event.target.checked;
            setSelection((current) =>
              checked
                ? [...current, row.id]
                : current.filter((id) => id !== row.id),
            );
          }}
        />
      ),
    },
    {
      key: "so",
      title: "SO 编号",
      width: 150,
      render: (_, row) => (
        <ButtonLink variant="text" size="compact" href={`/orders/${row.id}`}>
          <span
            className={`${styles.ellipsis} ${styles.soNumber}`}
            title={row.so}
          >
            {row.so}
          </span>
        </ButtonLink>
      ),
    },
    {
      key: "vessel",
      title: "船名 / 航次",
      width: 300,
      render: (_, row) => (
        <div
          className={styles.vessel}
          title={`${row.vessel || "待核对"} / ${row.voyage || "待核对"}`}
        >
          {row.vessel || "待核对"} / {row.voyage || "待核对"}
        </div>
      ),
    },
    ...(
      [
        ["opening", "开舱时间"],
        ["si", "补料时间"],
        ["cy", "截重 (CY)"],
        ["customs", "截关时间"],
      ] as const
    ).map(([key, title]): DataTableColumn<Row> => ({
      key,
      title,
      width: 182,
      render: (_, row) => {
        const value = row[key];
        const expired = key !== "opening" && row.expired.includes(value);
        return (
          <div
            className={`${styles.cutoff} ${styles.numeric}`}
            title={expired ? `${value}（已过截止）` : value}
          >
            <span className={styles.ellipsis}>{value}</span>
            {expired && (
              <span
                className={styles.expired}
                role="img"
                aria-label="已过截止"
              />
            )}
          </div>
        );
      },
    })),
    {
      key: "etb",
      title: "预计靠泊时间 (ETB)",
      width: 210,
      render: (_, row) => (
        <>
          <div className={styles.etbLine}>
            <strong className={styles.numeric}>
              {row.etb === TABLE_EMPTY_MARKER ? (
                <span className={styles.missing}>{TABLE_EMPTY_MARKER}</span>
              ) : (
                row.etb
              )}
            </strong>
            {row.etb === TABLE_EMPTY_MARKER &&
              !row.pendingEtb &&
              !canQuery(row) && (
                <ButtonLink
                  variant="text"
                  size="compact"
                  href={`/sailings/${row.sailingId}`}
                >
                  填入
                </ButtonLink>
              )}
          </div>
          {row.pendingEtb && (
            <div className={`${styles.caption} ${styles.numeric}`}>
              {row.pushedBack ? "推迟至" : "待确认"} {row.pendingEtb}
            </div>
          )}
        </>
      ),
    },
    {
      key: "status",
      title: "状态",
      width: 105,
      align: "left",
      render: (_, row) =>
        row.synced ? (
          <StatusTag type="success">已核对</StatusTag>
        ) : row.pendingId ? (
          <StatusTag type="info">已更新</StatusTag>
        ) : (
          <strong className={`${styles.numeric} ${styles.missing}`}>
            {TABLE_EMPTY_MARKER}
          </strong>
        ),
    },
    {
      key: "actions",
      title: "操作",
      width: 126,
      fixed: "right",
      align: "center",
      render: (_, row) => (
        <span
          title={
            row.pendingId
              ? undefined
              : row.queryActive
                ? "正在查询 ETB"
                : row.synced
                  ? "当前 ETB 已核对"
                  : "取得新的 ETB 后即可核对"
          }
        >
          <Button
            variant="text"
            size="compact"
            disabled={busy || !row.pendingId}
            onClick={() => openReview([row])}
          >
            核对
          </Button>
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      filter={filter}
      pagination={pagination}
      actions={
        <div className={styles.toolbarActions}>
          <ResultSummary className={styles.selectionCount}>
            已选择 {selected.length} 个 SO
          </ResultSummary>
          <Button
            variant="text"
            size="toolbar"
            disabled={busy || !selected.length}
            onClick={() => setSelection([])}
          >
            清除选择
          </Button>
          <Button
            size="toolbar"
            disabled={updateDisabled}
            title={
              queryable.length > 50
                ? "每次最多查询 50 个 SO，请勾选部分记录"
                : !queryable.length
                  ? "当前范围没有可自动查询的 SO"
                  : queryable.length < selected.length
                    ? "部分码头需人工录入，自动查询将跳过"
                    : undefined
            }
            onClick={() =>
              selected.length ? void query(queryable) : setConfirmPage(true)
            }
          >
            更新靠泊时间 (ETB)
          </Button>
        </div>
      }
    >
      {(message || busy) && (
        <FeedbackMessage>{busy ? "正在处理…" : message}</FeedbackMessage>
      )}
      <DataTable
        className={styles.table}
        aria-label="预计靠泊时间列表"
        columns={columns}
        dataSource={rows}
        rowKey="id"
        fitContainer
        empty={{ title: "暂无匹配的船期 SO" }}
      />
      {confirmPage && (
        <Dialog
          title="更新本页靠泊时间"
          onClose={() => setConfirmPage(false)}
          actions={
            <>
              <Button variant="outline" onClick={() => setConfirmPage(false)}>
                取消
              </Button>
              <Button
                disabled={updateDisabled}
                onClick={() => void query(queryable)}
              >
                确认查询
              </Button>
            </>
          }
        >
          <p>
            未勾选 SO。将为本页可自动查询的 {queryable.length} 个 SO 安排 ETB
            查询。
          </p>
          {queryable.length < rows.length && (
            <p>
              本页其余 {rows.length - queryable.length} 个 SO
              所属码头需人工录入。
            </p>
          )}
        </Dialog>
      )}
      {review.length > 0 && (
        <Dialog
          title="确认核对 ETB"
          subtitle="请核对下列靠泊时间。确认后，船期状态将变为已核对，新时间将同步至所有关联 SO。"
          onClose={() => setReview([])}
          closeDisabled={busy}
          message={busy ? "正在处理…" : undefined}
          actions={
            <>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => setReview([])}
              >
                取消
              </Button>
              <Button disabled={busy} onClick={() => void confirmReview()}>
                确认核对
              </Button>
            </>
          }
        >
          <ul>
            {review.map((row) => (
              <li key={row.sailingId}>
                {row.vessel} / {row.voyage} · {row.terminal} · {row.pendingEtb}
                {row.evidenceHref ? (
                  <ButtonLink
                    variant="text"
                    size="compact"
                    href={row.evidenceHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看截图凭证
                  </ButtonLink>
                ) : (
                  <span className={styles.caption}> · 暂无截图凭证</span>
                )}
              </li>
            ))}
          </ul>
        </Dialog>
      )}
    </PageContainer>
  );
}
