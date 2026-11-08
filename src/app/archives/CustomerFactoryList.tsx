import { TABLE_EMPTY_MARKER, TablePlaceholder } from "@/components/ui/table-placeholder";
import { TableBody } from "@/components/ui/table-body";
import { TableHeader } from "@/components/ui/table-header";
import { ArchiveFilterBar } from "./archive-filter-bar";
import { CustomerFactoryEditor } from "@/app/customers/customer-factory-editor";
import { ArchivePageContainer as PageContainer } from "@/app/archives/archive-page-container";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CreateActions } from "@/app/customers/create-actions";
import { CustomerStatusSwitch } from "@/components/customer-record-forms";
import { ArchiveEmptyState } from "@/components/ui/archive";
import { Pagination } from "@/components/ui/pagination";
import { PageHeader } from "@/components/ui/page-header";
import styles from "@/app/customers/page.module.css";

type Search = { pageSize?: string; q?: string; status?: string; page?: string };
const href = (input: Search, page: number) => {
  const params = new URLSearchParams();
  if (input.q) params.set("q", input.q);
  if (input.status) params.set("status", input.status);
  params.set("page", String(page));
  params.set("tab", "customers");
  if (input.pageSize) params.set("pageSize", input.pageSize);
  return `/archives?${params}`;
};

export async function CustomerFactoryList({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const input = await searchParams;
  const pageSize = [10, 20, 50, 100].includes(Number(input.pageSize))
    ? Number(input.pageSize)
    : 10;
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
  const [total, allActive, archiveTotal] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.customer.count(),
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
      <PageHeader
        title="业务档案"
        description="维护客户与装柜工厂档案，供订单、装柜计划和运输任务直接选择。"
      />
      <PageContainer
        activeTab="customers"
        tabsLabel="业务档案分类"
        actions={<CreateActions customers={allActive} />}
        pagination={
          <Pagination
            pageSize={pageSize}
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            href={(page) => href(input, page)}
            label="客户档案分页"
          />
        }
        filter={
          <ArchiveFilterBar
            tab="customers"
            q={q}
            status={status || ""}
            placeholder="客户或工厂名称"
          />
        }
      >
        <div
          className={styles.tableWrap}
          role="region"
          aria-label="客户与工厂档案"
          tabIndex={0}
        >
          <table className={styles.directoryTable}>
            <colgroup>
              <col style={{ width: "18%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <TableHeader>
              <tr>
                <th>客户名称</th>
                <th>所属工厂</th>
                <th>工厂地址</th>
                <th>联系人 / 电话</th>
                <th>客户状态</th>
                <th className={styles.actionHeading}>操作</th>
              </tr>
            </TableHeader>
            <TableBody>
              {customers.flatMap((customer) => {
                const factories = customer.factories.length
                  ? customer.factories
                  : [null];
                return factories.map((factory, index) => (
                  <tr key={`${customer.id}-${factory?.id || "empty"}`}>
                    {index === 0 && (
                      <td rowSpan={factories.length}>
                        <strong className={styles.customerName}>
                          {customer.name}
                        </strong>
                        {customer.factories.length > 1 && (
                          <span className={styles.factoryCount}>
                            {customer.factories.length} 家工厂
                          </span>
                        )}
                      </td>
                    )}
                    <td>
                      <span
                        className={styles.cellEllipsis}
                        title={factory?.name}
                      >
                        {factory?.name || "尚未添加工厂"}
                      </span>
                    </td>
                    <td>
                      {factory?.address ? (
                        <span className={styles.cellEllipsis} title={factory.address}>{factory.address}</span>
                      ) : <TablePlaceholder heading="工厂地址" />}
                    </td>
                    <td>
                      {factory?.contactName || factory?.contactPhone ? <>
                        <span>{factory.contactName || TABLE_EMPTY_MARKER}</span>
                        <span className={styles.customerCode}>
                          {factory?.contactPhone ? (
                            <a href={`tel:${factory.contactPhone}`}>
                              {factory.contactPhone}
                            </a>
                          ) : (
                            TABLE_EMPTY_MARKER
                          )}
                        </span>
                      </> : <TablePlaceholder heading="联系人 / 电话" />}
                    </td>
                    {index === 0 && (
                      <td rowSpan={factories.length}>
                        <CustomerStatusSwitch customer={customer} />
                      </td>
                    )}
                    <td>
                      <div className={styles.rowActions}>
                        <CustomerFactoryEditor
                          customer={customer}
                          factory={factory}
                        />
                      </div>
                    </td>
                  </tr>
                ));
              })}
            </TableBody>
          </table>
          {!customers.length && (
            <ArchiveEmptyState
              title={archiveTotal ? "没有匹配的客户档案" : "尚未建立客户档案"}
            >
              {archiveTotal
                ? "请调整关键词或状态筛选后重试。"
                : "点击右上角新增客户，再添加对应工厂。"}
            </ArchiveEmptyState>
          )}
        </div>
      </PageContainer>
    </>
  );
}
