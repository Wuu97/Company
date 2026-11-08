"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Status = "pending" | "synced";
type Order = {
  so: string;
  quantity: string;
  carrier: string;
  vessel: string;
  voyage: string;
  port: string;
  terminal: string;
  opening: string;
  cy: string;
  customs: string;
  etb: string;
  status: Status;
};

const shekou = { port: "蛇口", terminal: "Shekou Container Terminal" };
const yantian = {
  port: "盐田",
  terminal: "Yantian International Container Terminals",
};

const mockOrders: Order[] = [
  {
    so: "OOLU26980101",
    quantity: "1×40HQ",
    carrier: "OOCL",
    vessel: "OOCL HONG KONG",
    voyage: "081E",
    ...shekou,
    opening: "2026-11-08T08:00",
    cy: "2026-11-10T16:00",
    customs: "2026-11-10T18:00",
    etb: "2026-11-11T06:30",
    status: "pending",
  },
  {
    so: "OOLU26980102",
    quantity: "2×40HQ",
    carrier: "OOCL",
    vessel: "OOCL HONG KONG",
    voyage: "081E",
    ...shekou,
    opening: "2026-11-08T08:00",
    cy: "2026-11-10T16:00",
    customs: "2026-11-10T18:00",
    etb: "2026-11-11T06:30",
    status: "pending",
  },
  {
    so: "TSLU26980103",
    quantity: "1×20GP",
    carrier: "TS LINES",
    vessel: "TS SINGAPORE",
    voyage: "246S",
    ...shekou,
    opening: "2026-11-08T12:00",
    cy: "2026-11-11T10:00",
    customs: "2026-11-11T12:00",
    etb: "2026-11-12T09:00",
    status: "synced",
  },
  {
    so: "TSLU26980104",
    quantity: "1×40HQ",
    carrier: "TS LINES",
    vessel: "TS SINGAPORE",
    voyage: "246S",
    ...shekou,
    opening: "2026-11-08T12:00",
    cy: "2026-11-11T10:00",
    customs: "2026-11-11T12:00",
    etb: "2026-11-12T09:00",
    status: "synced",
  },
  {
    so: "MAEU26980105",
    quantity: "3×40HQ",
    carrier: "MAERSK",
    vessel: "MUNICH MAERSK",
    voyage: "645W",
    ...yantian,
    opening: "2026-11-09T08:00",
    cy: "2026-11-12T14:00",
    customs: "2026-11-12T17:00",
    etb: "2026-11-13T05:00",
    status: "pending",
  },
  {
    so: "COSU26980106",
    quantity: "2×20GP",
    carrier: "COSCO",
    vessel: "COSCO SHIPPING PEONY",
    voyage: "052E",
    ...yantian,
    opening: "2026-11-09T10:00",
    cy: "2026-11-12T16:00",
    customs: "2026-11-12T19:00",
    etb: "2026-11-13T12:30",
    status: "synced",
  },
  {
    so: "EGLV26980107",
    quantity: "1×40HQ",
    carrier: "EVERGREEN",
    vessel: "EVER GIVEN",
    voyage: "198W",
    ...shekou,
    opening: "2026-11-10T08:00",
    cy: "2026-11-13T18:00",
    customs: "2026-11-13T21:00",
    etb: "2026-11-14T09:15",
    status: "pending",
  },
];

const statusLabels: Record<Status, string> = {
  pending: "待核对",
  synced: "已同步",
};
const statusColors: Record<Status, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  synced: "border-emerald-200 bg-emerald-50 text-emerald-700",
};
const field =
  "h-8 rounded-md border border-slate-300 bg-white px-2.5 text-[13px] text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600";
const button =
  "inline-flex h-8 items-center justify-center rounded-md border px-3 text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50";
const primary = `${button} border-blue-700 bg-blue-700 text-white hover:bg-blue-800`;
const secondary = `${button} border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;
const link =
  "rounded text-[12px] font-medium text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600";
const check = "size-4 cursor-pointer accent-blue-700";
const time = (value: string) => value.replace("T", " ");
const sailingKey = (order: Order) =>
  JSON.stringify([
    order.carrier,
    order.vessel,
    order.voyage,
    order.port,
    order.terminal,
  ]);

type Action = { kind: "update" | "verify" | "detail"; orders: Order[] };

export default function SailingManagement({
  getOrderHref,
}: { getOrderHref?: (so: string) => string } = {}) {
  const [orders, setOrders] = useState(mockOrders);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [action, setAction] = useState<Action | null>(null);
  const [etb, setEtb] = useState("");
  const [message, setMessage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (action) dialog.current?.showModal();
  }, [action]);

  const terms = query.trim().toLowerCase().split(/\s+/);
  const visible = orders.filter((order) => {
    const searchable =
      `${order.so} ${order.vessel} ${order.voyage}`.toLowerCase();
    return (
      (status === "all" || order.status === status) &&
      terms.every((term) => searchable.includes(term))
    );
  });
  const checked = visible.filter((order) => selected.has(order.so));
  const allChecked = visible.length > 0 && checked.length === visible.length;
  const mixedSailings = new Set(checked.map(sailingKey)).size > 1;
  const pending = checked.filter((order) => order.status === "pending");

  function toggle(targets: Order[], enabled: boolean) {
    setSelected((previous) => {
      const next = new Set(previous);
      for (const { so } of targets) {
        if (enabled) next.add(so);
        else next.delete(so);
      }
      return next;
    });
  }

  function open(kind: Action["kind"], targets: Order[]) {
    setAction({ kind, orders: targets });
    setEtb(
      targets.every((order) => order.etb === targets[0]?.etb)
        ? (targets[0]?.etb ?? "")
        : "",
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action || action.kind === "detail") return;
    const ids = new Set(action.orders.map((order) => order.so));
    const updating = action.kind === "update";
    setOrders((previous) =>
      previous.map((order) => {
        if (!ids.has(order.so)) return order;
        return updating
          ? { ...order, etb, status: "pending" }
          : { ...order, status: "synced" };
      }),
    );
    toggle(action.orders, false);
    setMessage(
      updating
        ? `已更新 ${ids.size} 个 SO 的 ETB，等待核对。`
        : `已核对并同步 ${ids.size} 个 SO。`,
    );
    dialog.current?.close();
  }

  async function copy(so: string) {
    try {
      await navigator.clipboard.writeText(so);
      setMessage(`已复制 SO ${so}。`);
    } catch {
      setMessage(`无法自动复制，请手动复制 ${so}。`);
    }
  }

  const detail = action?.kind === "detail" ? action.orders[0] : undefined;

  return (
    <section
      aria-labelledby="sailing-title"
      className="min-h-screen bg-[#F8FAFC] p-4 text-slate-900 sm:p-6"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 id="sailing-title" className="text-xl font-semibold">
            船期管理
          </h1>
          <span className="group relative">
            <button
              type="button"
              aria-label="相同船期批量更新规则"
              aria-describedby="sailing-rule"
              className="grid size-5 place-items-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-600 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              ?
            </button>
            <span
              id="sailing-rule"
              role="tooltip"
              className="pointer-events-none invisible absolute left-0 top-full z-20 mt-2 w-64 rounded-md bg-slate-900 p-3 text-xs leading-5 text-white shadow-lg group-hover:visible group-focus-within:visible"
            >
              <strong className="block">相同船期批量更新规则</strong>
              船司、船名、航次、起运港及码头均相同的 SO 可一起更新
              ETB。仅修改已勾选的 SO，更新后进入待核对。
            </span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            aria-label="搜索 SO 号、船名或航次"
            placeholder="搜索 SO 号 / 船名 / 航次"
            className={`${field} w-60`}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(new Set());
            }}
          />
          <select
            aria-label="按同步状态筛选"
            className={field}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "all" | Status);
              setSelected(new Set());
            }}
          >
            <option value="all">全部状态</option>
            <option value="pending">待核对</option>
            <option value="synced">已同步</option>
          </select>
        </div>
      </header>

      <div className="mt-3 flex min-h-7 flex-wrap items-center gap-x-3 text-xs text-slate-500">
        <span>共 {visible.length} 条记录 · 中国标准时间 UTC+8</span>
        <span role="status" className="text-blue-800">
          {message}
        </span>
      </div>

      {checked.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
          <div className="flex flex-wrap items-center gap-x-3 text-[13px]">
            <strong className="text-blue-900">
              已选择 {checked.length} 个 SO
            </strong>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className={link}
            >
              清除选择
            </button>
            {mixedSailings && (
              <span className="text-amber-800">批量更新须选择相同船期</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={primary}
              disabled={mixedSailings}
              onClick={() => open("update", checked)}
            >
              批量更新靠泊时间 (ETB)
            </button>
            <button
              type="button"
              className={secondary}
              disabled={!pending.length}
              onClick={() => open("verify", pending)}
            >
              批量标记核对
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[1080px] border-collapse text-left text-[13px]">
          <thead className="bg-slate-100 text-xs font-semibold text-slate-600">
            <tr>
              <th scope="col" className="w-10 px-3 py-2.5">
                <input
                  type="checkbox"
                  aria-label="全选当前结果"
                  className={check}
                  checked={allChecked}
                  disabled={!visible.length}
                  ref={(input) => {
                    if (input)
                      input.indeterminate = checked.length > 0 && !allChecked;
                  }}
                  onChange={(event) => toggle(visible, event.target.checked)}
                />
              </th>
              {[
                "SO 信息",
                "船名航次与船司",
                "起运港与码头",
                "关键口岸时效",
                "预计靠泊时间 (ETB)",
                "操作",
              ].map((label) => (
                <th
                  key={label}
                  scope="col"
                  className={`whitespace-nowrap px-3 py-2.5 ${label === "操作" ? "text-right" : ""}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((order) => {
              const href = getOrderHref?.(order.so);
              return (
                <tr
                  key={order.so}
                  className={`border-t border-slate-200 hover:bg-slate-50 ${selected.has(order.so) ? "bg-blue-50/60" : ""}`}
                >
                  <td className="px-3 py-1.5">
                    <input
                      type="checkbox"
                      aria-label={`选择 ${order.so}`}
                      className={check}
                      checked={selected.has(order.so)}
                      onChange={(event) =>
                        toggle([order], event.target.checked)
                      }
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      {href ? (
                        <a
                          href={href}
                          className="font-mono font-semibold text-blue-700 hover:underline"
                        >
                          {order.so}
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="font-mono font-semibold text-blue-700 hover:underline"
                          onClick={() => open("detail", [order])}
                        >
                          {order.so}
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={`复制 ${order.so}`}
                        className={link}
                        onClick={() => void copy(order.so)}
                      >
                        复制
                      </button>
                    </div>
                    <span className="mt-0.5 inline-block rounded border border-slate-200 bg-slate-50 px-1.5 text-xs font-medium text-slate-700">
                      {order.quantity}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className="inline-block rounded border border-blue-100 bg-blue-50 px-1.5 text-xs font-semibold text-blue-800">
                      {order.carrier}
                    </span>
                    <div className="mt-0.5 font-semibold leading-4">
                      {order.vessel}{" "}
                      <span className="whitespace-nowrap">{order.voyage}</span>
                    </div>
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="font-semibold">{order.port}</div>
                    <div className="max-w-44 text-xs leading-4 text-slate-500">
                      {order.terminal}
                    </div>
                  </td>
                  <td className="px-3 py-1.5">
                    <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-2 whitespace-nowrap leading-[17px]">
                      <dt className="text-xs text-slate-500">开仓</dt>
                      <dd className="font-mono font-semibold">
                        <time dateTime={order.opening}>
                          {time(order.opening)}
                        </time>
                      </dd>
                      <dt className="text-xs text-slate-500">截重柜 (CY)</dt>
                      <dd className="font-mono font-semibold">
                        <time dateTime={order.cy}>{time(order.cy)}</time>
                      </dd>
                      <dt className="text-xs text-slate-500">截关</dt>
                      <dd className="font-mono font-semibold">
                        <time dateTime={order.customs}>
                          {time(order.customs)}
                        </time>
                      </dd>
                    </dl>
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    <time
                      dateTime={order.etb}
                      className="block font-mono text-[14px] font-bold text-blue-900"
                    >
                      {time(order.etb)}
                    </time>
                    <span
                      className={`mt-0.5 inline-block rounded border px-1.5 text-xs font-semibold ${statusColors[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    <div className="flex justify-end gap-2.5">
                      <button
                        type="button"
                        className={link}
                        onClick={() => open("update", [order])}
                      >
                        单单更新
                      </button>
                      <button
                        type="button"
                        className={`${link} disabled:cursor-not-allowed disabled:text-slate-500 disabled:no-underline`}
                        disabled={order.status === "synced"}
                        onClick={() => open("verify", [order])}
                      >
                        手动核对
                      </button>
                      {href ? (
                        <a className={link} href={href}>
                          查看详情
                        </a>
                      ) : (
                        <button
                          type="button"
                          className={link}
                          onClick={() => open("detail", [order])}
                        >
                          查看详情
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!visible.length && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  没有匹配的 SO，请调整搜索或筛选条件。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="sailing-dialog-title"
        onClose={() => setAction(null)}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl backdrop:bg-slate-950/40"
      >
        <h2 id="sailing-dialog-title" className="text-base font-semibold">
          {action?.kind === "update"
            ? "更新预计靠泊时间 (ETB)"
            : action?.kind === "verify"
              ? "确认核对 ETB"
              : "SO 详情"}
        </h2>
        {detail && (
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[13px] [&_dt]:text-slate-500">
            <dt>SO 编号</dt>
            <dd>{detail.so}</dd>
            <dt>柜量</dt>
            <dd>{detail.quantity}</dd>
            <dt>船期</dt>
            <dd>
              {detail.carrier} · {detail.vessel} {detail.voyage}
            </dd>
            <dt>起运港与码头</dt>
            <dd>
              {detail.port} / {detail.terminal}
            </dd>
            <dt>开仓</dt>
            <dd>{time(detail.opening)}</dd>
            <dt>截重柜 (CY)</dt>
            <dd>{time(detail.cy)}</dd>
            <dt>截关</dt>
            <dd>{time(detail.customs)}</dd>
            <dt>ETB</dt>
            <dd>
              {time(detail.etb)} · {statusLabels[detail.status]}
            </dd>
          </dl>
        )}
        {action && action.kind !== "detail" && (
          <form onSubmit={submit} className="mt-3 space-y-3">
            <p className="text-[13px] text-slate-600">
              {action.kind === "update"
                ? "保存后，以下 SO 将进入待核对。"
                : "请确认以下 ETB 已核对。确认后将标记为已同步。"}
            </p>
            <ul className="max-h-36 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs leading-5">
              {action.orders.map((order) => (
                <li key={order.so}>
                  {order.so} · {time(order.etb)}
                </li>
              ))}
            </ul>
            {action.kind === "update" && (
              <label className="block text-[13px] font-medium">
                新 ETB（中国标准时间 UTC+8）
                <input
                  required
                  type="datetime-local"
                  className={`${field} mt-1 block w-full`}
                  value={etb}
                  onChange={(event) => setEtb(event.target.value)}
                />
              </label>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className={secondary}
                onClick={() => dialog.current?.close()}
              >
                取消
              </button>
              <button type="submit" className={primary}>
                {action.kind === "update" ? "保存 ETB" : "确认核对"}
              </button>
            </div>
          </form>
        )}
        {detail && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className={secondary}
              onClick={() => dialog.current?.close()}
            >
              关闭
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
