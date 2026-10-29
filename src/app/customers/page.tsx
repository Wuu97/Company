import { Prisma } from "@prisma/client";
import businessStyles from "@/components/business.module.css";
import { prisma } from "@/lib/prisma";
import { CustomerForm } from "@/components/customer-form";
import { FactoryForm } from "@/components/factory-form";
import {
  CustomerRecordForm,
  FactoryRecordForm,
} from "@/components/customer-record-forms";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterActions, FilterClearLink, FilterField, FilterSelectField, FilterTextField, ListFilter, Pagination, ResultSummary } from "@/components/ui/list";
import { RecordCard, RecordCardHeader, RecordCardList } from "@/components/ui/record-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";

const pageSize = 50;
type Search = { q?: string; status?: string; page?: string };
const href = (input: Search, page: number) => {
  const params = new URLSearchParams();
  if (input.q) params.set("q", input.q);
  if (input.status) params.set("status", input.status);
  params.set("page", String(page));
  return `/customers?${params}`;
};

export default async function Customers({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const input = await searchParams;
  const q = input.q?.trim() || "";
  const status =
    input.status === "INACTIVE"
      ? "INACTIVE"
      : input.status === "ACTIVE"
        ? "ACTIVE"
        : undefined;
  const requestedPage = Math.max(1, Number(input.page) || 1);
  const where: Prisma.CustomerWhereInput = {
    ...(status ? { active: status === "ACTIVE" } : {}),
    ...(q
      ? {
          OR: [
            { code: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            {
              factories: {
                some: { name: { contains: q, mode: "insensitive" } },
              },
            },
          ],
        }
      : {}),
  };
  const [total, allActive] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);
  const customers = await prisma.customer.findMany({
    where,
    include: { factories: true },
    orderBy: { name: "asc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  return (
    <>
      <PageHeader title="客户与工厂" description="维护客户与装柜工厂档案，供订单、装柜计划和运输任务直接选择。" />
      <CustomerForm />
      <FactoryForm customers={allActive} />
      <ListFilter className={styles.filter}>
        <FilterField label="查找档案" search>
          <FilterTextField
            name="q"
            defaultValue={q}
            placeholder="客户编码、客户或工厂名称"
          />
        </FilterField>
        <FilterField label="档案状态">
          <FilterSelectField name="status" defaultValue={status || ""}>
            <option value="">全部</option>
            <option value="ACTIVE">启用</option>
            <option value="INACTIVE">停用</option>
          </FilterSelectField>
        </FilterField>
        <FilterActions className={styles.filterActions}>
          <Button type="submit">查看档案</Button>
          <FilterClearLink href="/customers" />
        </FilterActions>
      </ListFilter>
      <ResultSummary className={styles.resultSummary}>
        共 {total} 个客户，第 {currentPage} / {totalPages} 页。
      </ResultSummary>
      <RecordCardList className={styles.list} density="compact">
        {customers.length ? (
          customers.map((c) => (
            <RecordCard
              density="compact"
              className={c.active ? undefined : styles.inactive}
              key={c.id}
            >
              <RecordCardHeader density="compact" className={styles.header}>
                <div>
                  <span className={styles.label}>客户</span>
                  <b>{c.name}</b>
                  <small>{c.code}</small>
                </div>
                <StatusBadge tone={c.active ? "success" : "muted"}>{c.active ? "启用" : "停用"}</StatusBadge>
              </RecordCardHeader>
              <div className={styles.body}>
                <div>
                  <span className={styles.label}>装柜工厂</span>
                  {c.factories.length ? (
                    <div className={styles.factories}>
                      {c.factories.map((factory) => (
                        <div className={styles.factory} key={factory.id}>
                          <b>{factory.name}</b>
                          <span>{factory.address}</span>
                          {factory.contactName && (
                            <small>
                              {factory.contactName}
                              {factory.contactPhone
                                ? ` · ${factory.contactPhone}`
                                : ""}
                            </small>
                          )}
                          <FactoryRecordForm
                            customerId={c.id}
                            factory={factory}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={businessStyles["muted"]}>尚未添加工厂。</p>
                  )}
                </div>
              </div>
              <div className={styles.footer}>
                <CustomerRecordForm customer={c} />
              </div>
            </RecordCard>
          ))
        ) : (
          <EmptyState title="未找到客户档案">可尝试更换关键词或档案状态。</EmptyState>
        )}
      </RecordCardList>
      <Pagination currentPage={currentPage} totalPages={totalPages} href={page => href(input, page)} label="客户档案分页"/>
    </>
  );
}
