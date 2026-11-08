"use client";

import { TablePlaceholder } from "@/components/ui/table-placeholder";
import { FileText } from "lucide-react";
import { useState } from "react";
import { InlineOrderValue, type InlineOrderField } from "@/components/inline-order-value";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export type AiReviewRow = {
  field: string;
  label: string;
  value: string;
  confidence?: number;
  needsReview: boolean;
  evidence?: string;
  edit?: { field: InlineOrderField; value: string };
};

export function AiReviewTable({ orderId, rows }: { orderId: string; rows: AiReviewRow[] }) {
  const [reviewOnly, setReviewOnly] = useState(false);
  const [source, setSource] = useState<AiReviewRow | null>(null);
  const pending = rows.filter(row => row.needsReview);
  const visible = reviewOnly ? pending : rows;

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="m-0 text-sm font-semibold text-slate-900">AI 识别字段核对清单</h2>
        <div role="group" aria-label="核对清单筛选" className="flex items-center gap-0.5 rounded-md bg-slate-100 p-0.5">
          {[false, true].map(filter => (
            <button key={String(filter)} type="button" aria-pressed={reviewOnly === filter}
              onClick={() => setReviewOnly(filter)}
              className={`cursor-pointer rounded border-0 px-2 py-1 text-xs ${reviewOnly === filter ? "bg-white font-medium text-slate-800 shadow-xs" : "bg-transparent text-slate-500 hover:text-slate-800"}`}>
              {filter ? `需确认 (${pending.length})` : `全部 (${rows.length})`}
            </button>
          ))}
        </div>
      </div>
      {rows.length ? (
        <div className="overflow-x-auto">
          <table aria-label="AI 识别字段核对清单" className="w-full min-w-[440px] table-fixed border-collapse text-left text-[13px] text-slate-700">
            <colgroup><col className="w-[24%]" /><col /><col className="w-16" /><col className="w-40" /></colgroup>
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>{["核验字段", "AI 识别值", "置信度", "核验状态 / 操作"].map(label => <th key={label} scope="col" className="px-2 py-2 font-medium">{label}</th>)}</tr>
            </thead>
            <tbody>
              {visible.map(row => (
                <tr key={row.field} className="h-10 border-0 border-b border-solid border-slate-100">
                  <th scope="row" title={row.label} className="truncate px-2 text-left text-xs font-medium text-slate-600">{row.label}</th>
                  <td className="px-2">
                    <div className="flex min-w-0 items-center gap-1">
                      <span className="min-w-0 truncate" title={row.value}>{row.value}</span>
                      {row.evidence && (
                        <button type="button" aria-label={`查看${row.label}的原文依据`} title={row.evidence}
                          onClick={() => setSource(row)}
                          className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                          <FileText size={14} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className={`px-2 text-xs tabular-nums ${row.confidence !== undefined && row.confidence < 0.9 ? "text-amber-700" : "text-slate-500"}`}>
                    {row.confidence === undefined ? <TablePlaceholder heading="置信度" className="[--placeholder-heading-size:12px]" /> : `${Math.round(row.confidence * 100)}%`}
                  </td>
                  <td className="px-2">
                    <div className="flex min-w-0 items-center gap-1">
                      <span className={`shrink-0 whitespace-nowrap text-xs ${row.needsReview ? "text-amber-700" : "text-slate-500"}`}>
                        {row.needsReview ? "需确认" : "已通过"}
                      </span>
                      {row.edit && (
                        <div className="min-w-0 flex-1">
                          <InlineOrderValue orderId={orderId} field={row.edit.field} value={row.edit.value}
                            display="编辑 / 采纳" placeholder={`核对${row.label}`} className="min-h-0 whitespace-nowrap px-1 text-xs" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!visible.length && <tr><td colSpan={4} className="h-10 px-2 text-xs text-slate-500">没有需要确认的字段。</td></tr>}
            </tbody>
          </table>
        </div>
      ) : <p className="m-0 text-xs text-slate-500">暂无 AI 识别结果。可预览原件并手动核对订单信息。</p>}
      {source && (
        <Dialog title="原文依据" subtitle={source.label} onClose={() => setSource(null)}
          actions={<Button variant="secondary" size="toolbar" onClick={() => setSource(null)}>关闭</Button>}>
          <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{source.evidence}</p>
        </Dialog>
      )}
    </>
  );
}
