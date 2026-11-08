import { ArrowLeft, Building2, FileText, Ship } from "lucide-react";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { DeleteOrderButton } from "@/components/delete-order-button";
import type { InlineOrderField } from "@/components/inline-order-value";
import { SoFilePreview } from "@/components/so-file-preview";
import { SoVersionUpload } from "@/components/so-version-upload";
import { ApplyVersionChangeButton } from "@/components/apply-version-change-button";
import { ContainerAdjustmentForm } from "@/components/container-adjustment-form";
import { prisma } from "@/lib/prisma";
import { statusLabel, statusTone } from "@/lib/status-labels";
import { formatChinaDateTime, formatOperationalTimeText, resolveOpeningTime } from "@/lib/time";
import type { ParseReview } from "@/lib/so-review-task";
import { AiReviewTable, type AiReviewRow } from "./ai-review-table";
import { ShippingFields, type ShippingField } from "./shipping-fields";

const fieldLabels: Record<string, string> = {
  soNumber: "SO 编号", carrier: "船公司", customerReference: "客户参考号",
  vesselName: "船名", voyage: "航次", loadPort: "装货港", dischargePort: "卸货港",
  etdText: "预计开航时间（ETD）", etaText: "预计到港时间（ETA）", etbText: "预计靠泊时间（ETB）",
  openingText: "开舱时间", cutoffText: "截放行／截关时间", siCutoffText: "补料时间", vgmCutoffText: "VGM 截止时间",
  portCutoffText: "截重柜时间（CY）", emptyPickupLocation: "放行／提空柜地点",
  fullReturnLocation: "还柜地点", transportMode: "运输方式",
};

const shippingKeys = [
  "openingText", "siCutoffText", "portCutoffText", "cutoffText", "etbText",
  "etdText", "etaText", "carrier", "vesselName", "voyage", "emptyPickupLocation", "fullReturnLocation",
] as const;
const editableFields = new Set<string>(["customerReference", ...shippingKeys]);

type Extraction = {
  containers?: { containerType?: string; quantity?: number }[];
  parseReview?: ParseReview;
  ai?: {
    values?: Record<string, string>;
    evidence?: Record<string, string>;
    confidence?: Record<string, number>;
    siRule?: { destinationEvidence: string; clauseEvidence: string; cutoffEvidence: string; explanation: string };
    siRuleStatus?: "PREVIOUS_DAY_NOON" | "NEEDS_REVIEW";
  };
};

function versionChangeRows(changes: unknown) {
  if (!changes || typeof changes !== "object" || Array.isArray(changes)) return [];
  return Object.entries(changes).map(([field, value]) => ({
    field, label: fieldLabels[field] || "其他业务信息",
    value: typeof value === "object" && value !== null ? "已更新" : String(value ?? "已清空"),
  }));
}

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.soOrder.findUnique({
    where: { id },
    include: {
      files: { orderBy: { version: "desc" } },
      containers: { where: { active: true }, orderBy: { internalCode: "asc" } },
      plans: {
        where: { status: { notIn: ["CANCELLED", "REPLACED"] } },
        orderBy: { scheduledAt: "desc" },
        select: { status: true, items: { where: { active: true }, select: { containerUnitId: true } }, transportTask: { select: { status: true } } },
      },
      versionChanges: { where: { status: "PENDING" }, include: { soFileVersion: true } },
    },
  });
  if (!order) notFound();

  const extraction = order.files.find(file => file.rawExtraction)?.rawExtraction as Extraction | undefined;
  const ai = extraction?.ai;
  const summaryFields = new Set(["carrier", "vesselName", "voyage"]);
  const aiRows: AiReviewRow[] = Object.entries(ai?.values ?? {}).flatMap(([field, value]) => {
    if (typeof value !== "string" || !value.trim()) return [];
    const stored = Object.hasOwn(fieldLabels, field) ? order[field as keyof typeof order] : null;
    const current = typeof stored === "string" ? stored : "";
    const time = field.endsWith("Text");
    const normalized = time ? formatOperationalTimeText(value) : value.trim();
    const currentValue = time ? formatOperationalTimeText(current) : current.trim();
    const score = ai?.confidence?.[field];
    const confidence = typeof score === "number" && Number.isFinite(score) && score >= 0 && score <= 1 ? score : undefined;
    const flagged = extraction?.parseReview?.conflictingFields?.includes(field) || extraction?.parseReview?.missingCoreFields?.includes(field);
    const needsReview = normalized !== currentValue || (order.parseStatus !== "VERIFIED" && Boolean(flagged || (confidence !== undefined && confidence < 0.9)));
    return [{
      field, label: fieldLabels[field] || field, value, confidence, needsReview,
      evidence: ai?.evidence?.[field],
      edit: needsReview && editableFields.has(field) ? { field: field as InlineOrderField, value: normalized } : undefined,
    }];
  }).sort((a, b) => Number(!a.needsReview && summaryFields.has(a.field)) - Number(!b.needsReview && summaryFields.has(b.field)));
  const opening = resolveOpeningTime(order.openingText, order.portCutoffText);
  const formId = "so-shipping-fields";
  const cutoffDuplicatesSi = Boolean(order.cutoffText && order.siCutoffText
    && formatOperationalTimeText(order.cutoffText) === formatOperationalTimeText(order.siCutoffText));
  const fields: ShippingField[] = shippingKeys.map(key => {
    const time = key.endsWith("Text");
    const value = order[key] ?? "";
    return {
      key, time, label: fieldLabels[key],
      value: time ? formatOperationalTimeText(value) : value,
      estimated: key === "openingText" && opening?.source === "SYSTEM_ESTIMATED"
        ? opening.value
        : key === "siCutoffText" && order.siCutoffSource === "SYSTEM_ESTIMATED" && order.siCutoffText
          ? formatOperationalTimeText(order.siCutoffText)
          : undefined,
      needsReview: (key === "cutoffText" && cutoffDuplicatesSi) || (key === "siCutoffText" && order.siCutoffSource === "NEEDS_REVIEW") || (key === "etbText" && order.etbNeedsReview),
    };
  });
  const planByContainer = new Map<string, (typeof order.plans)[number]>();
  for (const plan of order.plans) {
    for (const item of plan.items) {
      if (!planByContainer.has(item.containerUnitId)) planByContainer.set(item.containerUnitId, plan);
    }
  }
  const containers = order.containers.length ? order.containers.map(container => {
    const plan = planByContainer.get(container.id);
    const status = plan?.transportTask?.status;
    const workStatus = status && status !== "PLANNED" && status !== "CANCELLED"
      ? { label: statusLabel(status), tone: statusTone(status) }
      : { label: "未排车", tone: "unread" as const };
    return { ...container, workStatus };
  }) : (extraction?.containers ?? []).flatMap(
    ({ containerType, quantity }) => containerType && quantity ? Array.from({ length: quantity }, () => ({ containerType })) : [],
  );

  return (
    <main className="bg-slate-50">
      <PageHeader
        className="sticky top-0 z-10 bg-slate-50 py-2"
        title={
          <>
            <ButtonLink href="/orders" variant="text" size="small" aria-label="返回 SO 订单"><ArrowLeft size={18} aria-hidden="true" /></ButtonLink>
            <span className="break-all">SO: {order.soNumber}</span>
            <StatusBadge tone={statusTone(order.status)}>{statusLabel(order.status)}</StatusBadge>
            <StatusBadge tone={statusTone(order.parseStatus)}>{statusLabel(order.parseStatus)}</StatusBadge>
          </>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <DeleteOrderButton orderId={id} returnToOrders size="toolbar" />
          </div>
        }
      />

      <PageContainer className="h-auto">
        <div className="grid w-full [&>section+section:not(#so-documents)]:border-0 [&>section+section:not(#so-documents)]:border-t [&>section+section:not(#so-documents)]:border-solid [&>section+section:not(#so-documents)]:border-slate-200 [&>section]:min-w-0 [&>section]:py-3 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0">
          <section aria-labelledby="execution-timeline">
            <ShippingFields orderId={id} formId={formId} fields={fields} referenceTime={Date.now()} voyageDetails={
              <>
                <div className="flex min-w-0 items-start gap-2">
                  <Building2 size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-slate-400" />
                  <div className="grid min-w-0 content-start gap-1">
                    <span className="text-xs text-slate-500">船公司</span>
                    <span className="flex min-h-6 items-center break-words text-sm font-semibold text-slate-900">{order.carrier || "待核对"}</span>
                  </div>
                </div>
                <div className="flex min-w-0 items-start gap-2">
                  <Ship size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-slate-400" />
                  <div className="grid min-w-0 content-start gap-1">
                    <span className="text-xs text-slate-500">船名／航次</span>
                    <span className="flex min-h-6 items-center break-words text-sm font-semibold text-slate-900">
                      {[order.vesselName, order.voyage].filter(Boolean).join(" / ") || "待核对"}
                    </span>
                  </div>
                </div>
              </>
            } />
          </section>

          <ContainerAdjustmentForm orderId={id} soNumber={order.soNumber} initialContainers={containers} />
          <section id="so-documents">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="m-0 flex items-center gap-2 text-base font-semibold text-slate-900">
                <FileText size={18} aria-hidden="true" className="text-blue-600" />
                单据版本
              </h2>
              <SoVersionUpload orderId={id} />
            </div>
            {order.files.length ? (
              <div className="grid gap-2">
                {order.files.map(file => (
                  <SoFilePreview
                    key={file.id}
                    fileId={file.id}
                    parseStatus={file.parseStatus}
                    fileName={file.originalName}
                    version={file.version}
                    uploadedAt={formatChinaDateTime(file.createdAt)}
                  />
                ))}
              </div>
            ) : <p className="m-0 text-xs text-slate-500">暂无原始单据。</p>}
            {order.versionChanges.map(change => {
              const rows = versionChangeRows(change.changes);
              return (
                <div key={change.id} className="mt-3 rounded-lg border border-solid border-amber-200 bg-amber-50 p-3 text-xs">
                  <h3 className="m-0 text-xs font-semibold text-amber-800">V{change.soFileVersion.version} 差异待确认</h3>
                  {rows.length ? <ul className="my-2 pl-4">{rows.map(row => <li key={row.field}>{row.label}：{row.value}</li>)}</ul>
                    : <p>本次版本包含待确认的业务信息更新。</p>}
                  <p>柜型和柜量变化需在柜位配置中单独处理。</p>
                  <ApplyVersionChangeButton url={`/api/orders/${id}/version-changes/${change.id}/apply`} />
                </div>
              );
            })}
          </section>
          {Boolean(extraction?.parseReview?.conflictingFields?.length) && (
            <section>
              <AiReviewTable orderId={id} rows={aiRows} />
              {ai?.siRuleStatus && (
                <details className="mt-2 text-xs text-slate-600">
                  <summary className="cursor-pointer">
                    AI 补料条款 · {order.siCutoffSource === "NEEDS_REVIEW" || ai.siRuleStatus === "NEEDS_REVIEW" ? "待核对" : "已核验原文"}
                  </summary>
                  {ai.siRule && (
                    <div className="mt-2 grid gap-1 [overflow-wrap:anywhere]">
                      <p className="m-0">{ai.siRule.explanation}</p>
                      <p className="m-0">航线依据　{ai.siRule.destinationEvidence}</p>
                      <p className="m-0">条款原文　{ai.siRule.clauseEvidence}</p>
                      <p className="m-0">截关依据　{ai.siRule.cutoffEvidence}</p>
                    </div>
                  )}
                </details>
              )}
            </section>
          )}
        </div>
      </PageContainer>
    </main>
  );
}
