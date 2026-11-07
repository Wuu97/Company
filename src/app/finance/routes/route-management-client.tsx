"use client";
import { ContainerTags, CountedNote, UnitInput, RouteNodes } from "./rate-form-fields";
import { AppPagination } from "@/components/ui/app-pagination";
import { useListPagination } from "@/components/ui/use-list-pagination";

import { PageContainer } from "@/components/ui/page-container";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { NavTabs } from "@/components/ui/nav-tabs";
import { CommonFilterBar } from "@/components/ui/common-filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatusBadgeSwitch } from "@/components/ui/status-badge-switch";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  TextField,
  SelectField,
  TextareaField,
  CheckboxField,
} from "@/components/ui/form-controls";
import styles from "./routes.module.css";

type Route = any;
const priceLabels: Record<string, string> = {
  DRIVER: "司机工资",
  PARTNER: "合作车运价",
  CUSTOMER: "客户报价",
  DRAFT: "草稿",
  CONFIRMED: "已确认",
  DISABLED: "已停用",
  PENDING: "待确认",
  REJECTED: "已拒绝",
};
const blanks = {
  code: "",
  name: "",
  origin: "",
  destination: "",
  viaPoints: "",
  routeType: "ROUND_TRIP",
  standardKilometers: "",
  standardToll: "",
  standardFuel: "",
  applicableVehicleTypes: [],
  applicableContainerTypes: [],
  note: "",
  active: true,
};
const list = (v: FormDataEntryValue | null) =>
  String(v || "")
    .split(/[,，\n]/)
    .map((x) => x.trim())
    .filter(Boolean);
async function request(url: string, method = "GET", body?: unknown) {
  const r = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "操作失败");
  return data;
}

export function RouteManagementClient({
  initialRoutes,
  settlementOptions,
}: {
  initialRoutes: Route[];
  settlementOptions: {
    drivers: Array<{ id: string; name: string }>;
    fleetOwners: Array<{ id: string; name: string }>;
    customers: Array<{ id: string; name: string }>;
    factories: Array<{ id: string; name: string }>;
  };
}) {
  const [routes, setRoutes] = useState(initialRoutes),
    [q, setQ] = useState(""),
    [tab, setTab] = useState("driver"),
    [customerId, setCustomerId] = useState(""),
    [driverId, setDriverId] = useState(""),
    [fleetOwnerId, setFleetOwnerId] = useState(""),
    [editing, setEditing] = useState<any>(null),
    [detail, setDetail] = useState<any>(null),
    [mode, setMode] = useState<"price" | "alias" | null>(null),
    [notice, setNotice] = useState("");
  const type =
    tab === "driver" ? "DRIVER" : tab === "partner" ? "PARTNER" : "CUSTOMER";
  const filtered = useMemo(
    () =>
      routes.filter(
        (r) =>
          `${r.code} ${r.name} ${r.origin} ${r.destination}`
            .toLowerCase()
            .includes(q.toLowerCase()) &&
          (tab === "partner"
            ? Boolean(r.standardKilometers || r.standardToll || r.standardFuel)
            : r.prices.some(
            (p: any) =>
              p.billType === type &&
              (type !== "CUSTOMER" ||
                !customerId ||
                (p.scope === "OBJECT" && p.customerId === customerId)) &&
              (type !== "DRIVER" || !driverId || !p.driverId || p.driverId === driverId) &&
              (type !== "PARTNER" ||
                !fleetOwnerId ||
                !p.fleetOwnerId ||
                p.fleetOwnerId === fleetOwnerId),
          )) &&
          (tab !== "customer" ||
            !customerId ||
            r.prices.some(
              (p: any) =>
                p.billType === "CUSTOMER" &&
                p.scope === "OBJECT" &&
                p.customerId === customerId,
            )) &&
          (tab !== "driver" ||
            !driverId ||
            r.prices.some(
              (p: any) =>
                p.billType === "DRIVER" &&
                (!p.driverId || p.driverId === driverId),
            )) &&
          (tab !== "partner" || Boolean(r.standardKilometers || r.standardToll || r.standardFuel)),
      ),
    [routes, q, tab, customerId, driverId, fleetOwnerId],
  );
  const refresh = async (id: string) => {
    const value = await request(`/api/finance/routes/${id}`);
    setDetail(value);
    setRoutes((all) => all.map((r) => (r.id === id ? { ...r, ...value } : r)));
  };
  async function saveRoute(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const routeParts = String(f.get("name") || "")
      .split("-")
      .map((part) => part.trim())
      .filter(Boolean);
    const body = {
      name: f.get("name"),
      origin: String(f.get("origin") || ""),
      destination: String(f.get("destination") || ""),
      viaPoints: f.getAll("viaPoint").map(String).join("-") || null,
      routeType: f.get("routeType"),
      standardKilometers: f.get("standardKilometers") || null,
      standardToll: f.get("standardToll") || null,
      standardFuel: f.get("standardFuel") || null,
      applicableVehicleTypes: [],
      applicableContainerTypes: list(f.get("applicableContainerTypes")),
      note: f.get("note") || null,
      active: f.get("active") === "on",
    };
    try {
      const r = editing.id
        ? await request(`/api/finance/routes/${editing.id}`, "PATCH", body)
        : await request("/api/finance/routes", "POST", body);
      setEditing(null);
      setNotice("路线已保存");
      if (!editing.id)
        setRoutes((all) => [...all, { ...r, aliases: [], prices: [] }]);
      await refresh(r.id);
    } catch (x) {
      setNotice(x instanceof Error ? x.message : "保存失败");
      throw x;
    }
  }
  async function savePrice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const priceCustomerId = String(f.get("customerId") || customerId || "");
    if (type === "CUSTOMER" && !priceCustomerId) return setNotice("请选择客户");
    const body = {
      routeId: f.get("routeId") || detail?.id,
      billType: type,
      scope: type === "CUSTOMER" ? "OBJECT" : "GENERAL",
      settlementObjectId: type === "CUSTOMER" ? priceCustomerId : null,
      billingBases: [f.get("billingBasis")],
      combinations: [f.get("combination")],
      applicableVehicleTypes: [],
      applicableContainerTypes: list(f.get("containerTypes")),
      unitPrice: f.get("unitPrice"),
      factoryId: f.get("factoryId") || null,
      effectiveFrom: String(f.get("effectiveFrom")),
      effectiveTo: null,
      status: "CONFIRMED",
      note: f.get("note") || null,
      fees: [],
    };
    try {
      await request("/api/finance/route-prices", "POST", body);
      setMode(null);
      setNotice(body.status === "CONFIRMED" ? "版本已确认，将按有效期生效" : "版本已保存为草稿");
      await refresh(String(body.routeId));
    } catch (x) {
      setNotice(x instanceof Error ? x.message : "保存失败");
      throw x;
    }
  }
  async function toggleRoute(route: Route, active = !route.active) {
    try {
      const updated = await request(`/api/finance/routes/${route.id}`, "PATCH", { name: route.name, origin: route.origin, destination: route.destination, viaPoints: route.viaPoints || null, routeType: route.routeType, standardKilometers: route.standardKilometers || null, standardToll: route.standardToll || null, standardFuel: route.standardFuel || null, applicableVehicleTypes: route.applicableVehicleTypes || [], applicableContainerTypes: route.applicableContainerTypes || [], note: route.note || null, active });
      setRoutes(all => all.map(item => item.id === route.id ? { ...item, ...updated } : item));
    } catch (error) { setNotice(error instanceof Error ? error.message : "状态更新失败");
      throw error; }
  }
  async function saveAlias(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await request(`/api/finance/routes/${detail.id}/aliases`, "POST", {
        rawText: f.get("rawText"),
        normalizedText: f.get("normalizedText"),
        source: f.get("source") || null,
        note: f.get("note") || null,
      });
      setMode(null);
      setNotice("候选别名已保存，确认前不参与自动匹配");
      await refresh(detail.id);
    } catch (x) {
      setNotice(x instanceof Error ? x.message : "保存失败");
    }
  }
  async function priceStatus(id: string, status: string) {
    try {
      await request(`/api/finance/route-prices/${id}`, "PATCH", { status });
      await refresh(detail.id);
    } catch (x) {
      setNotice(x instanceof Error ? x.message : "更新失败");
    }
  }
  const shownPrices =
    detail?.prices.filter(
      (p: any) =>
        p.billType === type &&
        (type !== "CUSTOMER" ||
          !customerId ||
          (p.scope === "OBJECT" && p.customerId === customerId)) &&
        (type !== "DRIVER" ||
          !driverId ||
          !p.driverId ||
          p.driverId === driverId) &&
        (type !== "PARTNER" ||
          !fleetOwnerId ||
          !p.fleetOwnerId ||
          p.fleetOwnerId === fleetOwnerId),
    ) || [];
  const pagination = useListPagination(filtered,JSON.stringify([tab,q,customerId,driverId,fleetOwnerId]));
  const priceFor = (r: Route) => r.prices.find((p: any) => p.billType === type && (type !== "CUSTOMER" || !customerId || (p.scope === "OBJECT" && p.customerId === customerId)) && (type !== "DRIVER" || !driverId || !p.driverId || p.driverId === driverId) && (type !== "PARTNER" || !fleetOwnerId || !p.fleetOwnerId || p.fleetOwnerId === fleetOwnerId));
  const columns: DataTableColumn<Route>[] = [
    { key: "name", minWidth: 205, align: "left", title: tab === "partner" ? "装卸地点" : "行驶路线", dataIndex: "name", render: (_, r) => <span className={styles.cellText} title={r.name}>{r.name}</span> },
    ...(tab !== "partner" ? [{ key: "factory", minWidth: 205, align: "left" as const, title: "工厂名称", render: (_: unknown, r: Route) => { const price = priceFor(r); const name = price?.factory?.name || price?.customer?.factories?.[0]?.name || "—"; return <span className={styles.cellText} title={name}>{name}</span>; } }] : []),
    { key: "container", width: 120, align: "center", title: "柜型", render: (_, r) => (tab === "partner" ? r.applicableContainerTypes : priceFor(r)?.applicableContainerTypes)?.join("、") || "—" },
    ...(tab === "partner" ? [
      { key: "kilometers", title: "公里数", width: 110, dataIndex: "standardKilometers", type: "number" as const },
      { key: "toll", title: "路桥费", width: 150, dataIndex: "standardToll", type: "money" as const },
      { key: "fuel", title: "油费", width: 150, dataIndex: "standardFuel", type: "money" as const },
    ] : [{ key: "price", width: 150, align: "right" as const, title: tab === "driver" ? "付运费" : "运费", type: "money" as const, render: (_: unknown, r: Route) => { const value = priceFor(r)?.unitPrice; return value == null ? "—" : new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(Number(value)); } }]),
    { key: "status", title: "状态", width: 120, align: "center", render: (_, r) => <StatusBadgeSwitch active={r.active} label="路线状态" confirmation="both" onChange={active => toggleRoute(r, active)} /> },
  ];
  return (
    <main>
      <PageHeader
        title="路线费用管理"
        description="分别维护司机工资、合作车运价和客户报价模板；三类费用彼此独立。"

      />
<PageContainer pagination={<AppPagination {...pagination.props} />} actions={<><Button create size="toolbar" onClick={() => setEditing(blanks)}>新增路线</Button><Button create size="toolbar" variant="secondary" onClick={() => setMode("price")}>新增价格版本</Button></>} tabsLabel="路线费用分类" tabs={["driver", "partner", "customer"].map((k) => ({
          label: priceLabels[k === "driver" ? "DRIVER" : k === "partner" ? "PARTNER" : "CUSTOMER"],
          active: tab === k,
          onClick: () => setTab(k),
        }))} filter={<CommonFilterBar
        values={{ search: q, object: tab === "driver" ? driverId : tab === "customer" ? customerId : fleetOwnerId }}
        items={[
          { type: "input", key: "search", label: "搜索路线", placeholder: "搜索路线名称/编号" },
          { type: "select", key: "object", label: tab === "driver" ? "全部司机" : tab === "customer" ? "全部客户" : "全部合作车", options: (tab === "driver" ? settlementOptions.drivers : tab === "customer" ? settlementOptions.customers : settlementOptions.fleetOwners).map(item => ({ value: item.id, label: item.name })) },
        ]}
        onSearch={values => { setQ(String(values.search || "")); const object = String(values.object || ""); if (tab === "driver") setDriverId(object); else if (tab === "customer") setCustomerId(object); else setFleetOwnerId(object); }}
      />}>
      {notice && <p className={styles.notice} role="status">{notice}</p>}

      <div className={tab === "partner" ? styles.partnerTableFrame : styles.rateTableFrame}><DataTable fitContainer className={styles.routeTable} mobileHint={null} columns={columns} dataSource={pagination.items} rowKey="id" empty={{ title: tab === "customer" && customerId ? "该客户尚无报价模板" : "未找到路线", description: "可新增路线或调整筛选条件。" }} /></div>
      {editing && (
        <RouteForm
          value={editing}
          onClose={() => setEditing(null)}
          onSubmit={saveRoute}
        />
      )}
      {detail && (
        <Dialog
          title={detail.name}
          onClose={() => setDetail(null)}
          actions={
            <Button size="toolbar" variant="secondary" onClick={() => setDetail(null)}>
              关闭
            </Button>
          }
          message={notice}
        >
          <NavTabs
            label="路线详情"
            items={["driver", "partner", "customer"].map((k) => ({
              label: priceLabels[k === "driver" ? "DRIVER" : k === "partner" ? "PARTNER" : "CUSTOMER"],
              active: tab === k,
              onClick: () => setTab(k),
            }))}
          />
          <Prices rows={shownPrices} onAdd={() => setMode("price")} onStatus={priceStatus} />
        </Dialog>
      )}
      {mode === "price" && (
        <PriceForm
          type={type}
          options={
            type === "DRIVER"
              ? settlementOptions.drivers
              : type === "PARTNER"
                ? settlementOptions.fleetOwners
                : settlementOptions.customers
          }
          factories={settlementOptions.factories}
          selectedObjectId={type === "CUSTOMER" ? customerId : ""}
          routes={routes}
          onClose={() => setMode(null)}
          onSubmit={savePrice}
        />
      )}
      {mode === "alias" && (
        <AliasForm onClose={() => setMode(null)} onSubmit={saveAlias} />
      )}

</PageContainer>
</main>
  );
}
function RouteForm({ value, onClose, onSubmit }: any) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  return (
    <Dialog
      width={580}
      title={value.id ? "编辑路线" : "新增路线"}
      onClose={onClose}
      closeDisabled={saving}
      message={error || undefined}
      actions={
        <>
          <CheckboxField className={styles.routeFooterToggle} form="route-form" name="active" defaultChecked={value.active !== false}>启用路线</CheckboxField>
          <Button disabled={saving} size="toolbar" variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button disabled={saving} size="toolbar" type="submit" form="route-form">
            保存
          </Button>
        </>
      }
    >
      <form id="route-form" className={styles.compactForm} onSubmit={async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (saving) return; setSaving(true); setError(""); try { await onSubmit(event); } catch (failure) { setError(failure instanceof Error ? failure.message : "保存失败"); } finally { setSaving(false); } }}>
        <RouteNodes value={value} />
        <UnitInput label="标准公里数" name="standardKilometers" unit="km" initial={String(value.standardKilometers || "")} />
        <SelectField
          label="路线类型"
          name="routeType"
          required
          defaultValue={value.routeType}
        >
          <option value="ONE_WAY">单程</option>
          <option value="ROUND_TRIP">往返</option>
          <option value="MULTI_LEG">多运输段</option>
        </SelectField>
        <UnitInput label="标准路桥费" name="standardToll" unit="元" initial={String(value.standardToll || "")} />
        <UnitInput label="标准油费" name="standardFuel" unit="元" initial={String(value.standardFuel || "")} />
        <ContainerTags name="applicableContainerTypes" initial={value.applicableContainerTypes || []} />
        <CountedNote initial={value.note || ""} />

      </form>
    </Dialog>
  );
}
function Prices({ rows, onAdd, onStatus }: any) {
  return (
    <section className={styles.detail}>
      <Button onClick={onAdd} create>
        新增价格版本
      </Button>
      {rows.length ? (
        rows.map((p: any) => (
          <article className={styles.price} key={p.id}>
            <b>
              {p.scope === "OBJECT"
                ? p.driver?.name ||
                  p.fleetOwner?.name ||
                  p.customer?.name ||
                  "专属对象"
                : "通用价格"}
            </b>{" "}
            · {p.unitPrice} / {p.billingBases.join(",")}{" "}
            <StatusBadge
              tone={
                p.status === "CONFIRMED"
                  ? "success"
                  : p.status === "DISABLED"
                    ? "muted"
                    : "warning"
              }
            >
              {priceLabels[p.status]}
            </StatusBadge>
            <small>
              {new Date(p.effectiveFrom).toLocaleDateString()} 至{" "}
              {p.effectiveTo
                ? new Date(p.effectiveTo).toLocaleDateString()
                : "长期"}
            </small>
            {p.fees?.length ? (
              <p>
                费用组成：
                {p.fees
                  .map(
                    (f: any) =>
                      `${f.label} ${f.amount}${f.includedInBaseRate ? "（已含）" : ""}${f.participatesInSettlement ? "（计入）" : ""}`,
                  )
                  .join("；")}
              </p>
            ) : null}
            {p.status === "DRAFT" && (
              <Button onClick={() => onStatus(p.id, "CONFIRMED")}>
                确认
              </Button>
            )}
            {p.status !== "DISABLED" && (
              <Button

                variant="secondary"
                onClick={() => onStatus(p.id, "DISABLED")}
              >
                停用
              </Button>
            )}
          </article>
        ))
      ) : (
        <EmptyState title="暂无价格">新增版本后确认即可用于结算。</EmptyState>
      )}
    </section>
  );
}
function PriceForm({
  type,
  options,
  factories,
  routes,
  selectedObjectId,
  onClose,
  onSubmit,
}: any) {
  const [basis, setBasis] = useState("TRIP");
  const [from, setFrom] = useState(new Date().toLocaleDateString("sv-SE"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const needsFactory = type === "DRIVER" || type === "CUSTOMER";
  return (
    <Dialog
      width={580}
      title={`新增${priceLabels[type]}版本`}
      onClose={onClose}
      closeDisabled={saving}
      message={error || undefined}
      actions={
        <>
          <Button disabled={saving} size="toolbar" variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button disabled={saving} size="toolbar" type="submit" form="price-form" name="saveStatus" value="CONFIRMED">保存</Button>
        </>
      }
    >
      <form id="price-form" className={styles.compactForm} onSubmit={async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (saving) return; setSaving(true); setError(""); try { await onSubmit(event); } catch (failure) { setError(failure instanceof Error ? failure.message : "保存失败"); } finally { setSaving(false); } }}>
        <SelectField label="路线" name="routeId" required><option value="">请选择路线</option>{routes.map((route: Route) => <option key={route.id} value={route.id}>{route.name}</option>)}</SelectField>
        {type === "CUSTOMER" && <SelectField label="客户" name="customerId" defaultValue={selectedObjectId || ""} required><option value="">请选择客户</option>{options.map((option: { id: string; name: string }) => <option key={option.id} value={option.id}>{option.name}</option>)}</SelectField>}
        {needsFactory && <SelectField label="工厂名称" name="factoryId" required><option value="">请选择工厂</option>{factories.map((factory: { id: string; name: string }) => <option key={factory.id} value={factory.id}>{factory.name}</option>)}</SelectField>}
        <SelectField label="计费单位" name="billingBasis" value={basis} onChange={e => setBasis(e.target.value)}>
          <option value="CONTAINER">按柜</option>
          <option value="TRIP">按趟</option>
          <option value="LEG">按运输段</option>
          <option value="COMBINATION">组合计费</option>
          <option value="ADHOC">独立附加费用</option>
        </SelectField>
        <SelectField label="组合类型" name="combination" defaultValue="SINGLE">
          <option value="SINGLE">单拖</option>
          <option value="DOUBLE_TRAILER">孖拖</option>
          <option value="SHARED_TRAILER">拼孖拖</option>
        </SelectField>
        <UnitInput label="基础单价" name="unitPrice" required prefix="¥" unit={basis === "TRIP" ? "/ 趟" : basis === "CONTAINER" ? "/ 柜" : basis === "LEG" ? "/ 运输段" : basis === "COMBINATION" ? "/ 组合" : "/ 项"} />
        <TextField label="生效日期" name="effectiveFrom" type="date" required value={from} onChange={e => setFrom(e.target.value)} />
        <ContainerTags name="containerTypes" />
        <CountedNote />
      </form>
    </Dialog>
  );
}
function AliasForm({ onClose, onSubmit }: any) {
  return (
    <Dialog
      title="新增候选别名"
      onClose={onClose}
      actions={
        <>
          <Button size="toolbar" variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button size="toolbar" type="submit" form="alias-form">
            保存候选
          </Button>
        </>
      }
    >
      <form id="alias-form" className={styles.dialogForm} onSubmit={onSubmit}>
        <TextField label="原始路线文本" name="rawText" required />
        <TextField label="规范化文本" name="normalizedText" required />
        <TextField label="来源" name="source" />
        <TextareaField label="说明" name="note" />
      </form>
    </Dialog>
  );
}
