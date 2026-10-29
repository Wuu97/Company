"use client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { NavTabs } from "@/components/ui/nav-tabs";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { CompactSelect } from "@/components/ui/compact-select";
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
      code: editing.id ? editing.code : undefined,
      name: f.get("name"),
      origin: routeParts[0] || "未填写",
      destination: routeParts.at(-1) || "未填写",
      viaPoints: routeParts.slice(1, -1).join("-") || null,
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
      effectiveFrom: new Date().toISOString().slice(0, 10),
      effectiveTo: null,
      note: f.get("note") || null,
      fees: [],
    };
    try {
      await request("/api/finance/route-prices", "POST", body);
      setMode(null);
      setNotice("新版本已保存为草稿；确认后才能用于结算");
      await refresh(String(body.routeId));
    } catch (x) {
      setNotice(x instanceof Error ? x.message : "保存失败");
    }
  }
  async function toggleRoute(route: Route, active = !route.active) {
    try {
      const updated = await request(`/api/finance/routes/${route.id}`, "PATCH", { code: route.code, name: route.name, origin: route.origin, destination: route.destination, viaPoints: route.viaPoints || null, routeType: route.routeType, standardKilometers: route.standardKilometers || null, standardToll: route.standardToll || null, standardFuel: route.standardFuel || null, applicableVehicleTypes: route.applicableVehicleTypes || [], applicableContainerTypes: route.applicableContainerTypes || [], note: route.note || null, active });
      setRoutes(all => all.map(item => item.id === route.id ? { ...item, ...updated } : item));
    } catch (error) { setNotice(error instanceof Error ? error.message : "状态更新失败"); }
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
  async function aliasStatus(id: string, status: string) {
    try {
      await request(`/api/finance/route-aliases/${id}`, "PATCH", {
        status,
        routeId: detail.id,
      });
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
  return (
    <main>
      <PageHeader
        title="路线费用管理"
        description="分别维护司机工资、合作车运价和客户报价模板；三类费用彼此独立。"
        actions={<><Button onClick={() => setEditing(blanks)}>新增路线</Button><Button variant="secondary" onClick={() => setMode("price")}>新增价格版本</Button></>}
      />
      <NavTabs
        label="路线费用分类"
        items={["driver", "partner", "customer"].map((k) => ({
          label: priceLabels[k === "driver" ? "DRIVER" : k === "partner" ? "PARTNER" : "CUSTOMER"],
          active: tab === k,
          onClick: () => setTab(k),
        }))}
      />
      <div className={styles.toolbar}>
        <TextField
          label="搜索路线"
          className={styles.routeSearch}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索路线名称"
        />
        {tab === "customer" && (
          <SelectField
            label="客户报价模板"
            className={styles.customerSelect}
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">全部客户</option>
            {settlementOptions.customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </SelectField>
        )}
        {tab === "driver" && (
          <SelectField
            label="司机工资模板"
            className={styles.customerSelect}
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
          >
            <option value="">全部司机</option>
            {settlementOptions.drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </SelectField>
        )}
        {tab === "partner" && (
          <SelectField
            label="合作车运价模板"
            className={styles.customerSelect}
            value={fleetOwnerId}
            onChange={(e) => setFleetOwnerId(e.target.value)}
          >
            <option value="">全部合作车</option>
            {settlementOptions.fleetOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </SelectField>
        )}
        {notice && <span role="status">{notice}</span>}
      </div>
      {filtered.length ? (
        <DataTable>
          <thead>
            <tr>{tab === "driver" ? <><th>行驶路线</th><th>工厂名称</th><th>柜型</th><th>付运费</th></> : tab === "customer" ? <><th>行驶路线</th><th>工厂名称</th><th>柜型</th><th>运费</th></> : <><th>装卸地点</th><th>柜型</th><th>公里数</th><th>路桥费</th><th>油费</th></>}<th>状态</th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => { const price = r.prices.find((p: any) => p.billType === type && (type !== "CUSTOMER" || !customerId || (p.scope === "OBJECT" && p.customerId === customerId)) && (type !== "DRIVER" || !driverId || !p.driverId || p.driverId === driverId) && (type !== "PARTNER" || !fleetOwnerId || !p.fleetOwnerId || p.fleetOwnerId === fleetOwnerId)); const factoryName = price?.factory?.name || price?.customer?.factories?.[0]?.name || "—"; return <tr key={r.id}>{tab === "driver" || tab === "customer" ? <><td>{r.name}</td><td>{factoryName}</td><td>{price?.applicableContainerTypes?.join("、") || "—"}</td><td>{price?.unitPrice ?? "—"}</td></> : <><td>{r.name}</td><td>{r.applicableContainerTypes?.join("、") || "—"}</td><td>{r.standardKilometers || "—"}</td><td>{r.standardToll || "—"}</td><td>{r.standardFuel || "—"}</td></>}<td><CompactSelect aria-label="修改路线状态" value={r.active ? "ACTIVE" : "INACTIVE"} onChange={event => toggleRoute(r, event.target.value === "ACTIVE")}><option value="ACTIVE">启用</option><option value="INACTIVE">停用</option></CompactSelect></td></tr>; })}
          </tbody>
        </DataTable>
      ) : (
        <EmptyState
          title={
            tab === "customer" && customerId
              ? "该客户尚无报价模板"
              : "未找到路线"
          }
        >
          {tab === "customer" && customerId
            ? "可从候选标准创建该客户的专属报价。"
            : "可新增路线或调整搜索条件。"}
        </EmptyState>
      )}
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
            <Button variant="secondary" onClick={() => setDetail(null)}>
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
    </main>
  );
}
function RouteForm({ value, onClose, onSubmit }: any) {
  return (
    <Dialog
      title={value.id ? "编辑路线" : "新增路线"}
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" form="route-form">
            保存
          </Button>
        </>
      }
    >
      <form id="route-form" className={styles.form} onSubmit={onSubmit}>
        <TextField
          label="路线名称"
          name="name"
          required
          defaultValue={value.name}
          hint="按“起点-途经点-终点”填写，例如：盐田-新兴-盐田；系统会自动识别。"
        />
        <SelectField
          label="路线类型"
          name="routeType"
          defaultValue={value.routeType}
        >
          <option value="ONE_WAY">单程</option>
          <option value="ROUND_TRIP">往返</option>
          <option value="MULTI_LEG">多运输段</option>
        </SelectField>
        <TextField
          label="标准公里数"
          name="standardKilometers"
          inputMode="decimal"
          defaultValue={value.standardKilometers || ""}
        />
        <TextField
          label="标准路桥费"
          name="standardToll"
          inputMode="decimal"
          defaultValue={value.standardToll || ""}
        />
        <TextField
          label="标准油费"
          name="standardFuel"
          inputMode="decimal"
          defaultValue={value.standardFuel || ""}
        />
        <TextField
          label="适用柜型（逗号分隔）"
          name="applicableContainerTypes"
          defaultValue={(value.applicableContainerTypes || []).join(",")}
        />
        <TextareaField
          label="备注"
          name="note"
          defaultValue={value.note || ""}
        />
        <CheckboxField name="active" defaultChecked={value.active}>
          启用路线
        </CheckboxField>
      </form>
    </Dialog>
  );
}
function Prices({ rows, onAdd, onStatus }: any) {
  return (
    <section className={styles.detail}>
      <Button size="small" onClick={onAdd}>
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
              <Button size="small" onClick={() => onStatus(p.id, "CONFIRMED")}>
                确认
              </Button>
            )}
            {p.status !== "DISABLED" && (
              <Button
                size="small"
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
  const needsFactory = type === "DRIVER" || type === "CUSTOMER";
  return (
    <Dialog
      title={`新增${priceLabels[type]}版本`}
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" form="price-form">
            保存草稿
          </Button>
        </>
      }
    >
      <form id="price-form" className={styles.form} onSubmit={onSubmit}>
        <SelectField label="路线" name="routeId" required><option value="">请选择路线</option>{routes.map((route: Route) => <option key={route.id} value={route.id}>{route.name}</option>)}</SelectField>
        {type === "CUSTOMER" && <SelectField label="客户" name="customerId" defaultValue={selectedObjectId || ""} required><option value="">请选择客户</option>{options.map((option: { id: string; name: string }) => <option key={option.id} value={option.id}>{option.name}</option>)}</SelectField>}
        {needsFactory && <SelectField label="工厂名称" name="factoryId" required><option value="">请选择工厂</option>{factories.map((factory: { id: string; name: string }) => <option key={factory.id} value={factory.id}>{factory.name}</option>)}</SelectField>}
        <SelectField label="计费单位" name="billingBasis" defaultValue="TRIP">
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
        <TextField
          label="基础单价"
          name="unitPrice"
          required
          inputMode="decimal"
        />
        <TextField label="适用柜型（逗号分隔）" name="containerTypes" />
        <TextareaField label="备注" name="note" />
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
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" form="alias-form">
            保存候选
          </Button>
        </>
      }
    >
      <form id="alias-form" className={styles.form} onSubmit={onSubmit}>
        <TextField label="原始路线文本" name="rawText" required />
        <TextField label="规范化文本" name="normalizedText" required />
        <TextField label="来源" name="source" />
        <TextareaField label="说明" name="note" />
      </form>
    </Dialog>
  );
}
