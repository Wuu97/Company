import { Pagination } from "@/components/ui/pagination";
import { Avatar } from "@/components/ui/avatar";
import { EntityCard } from "@/components/ui/entity-card";
import { PageContainer } from "@/components/ui/page-container";
import { EtbManualControl } from "@/components/etb-manual-control";
import { formatChinaDateTime } from "@/lib/time";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TogglePlatformButton, AddPlatformButton, EditCredentialButton, TestCredentialButton, CreateMemberButton, ViewCredentialButton } from "@/components/admin-settings-forms";
import { UserAdminActions } from "@/components/user-admin-actions";
import { statusLabel } from "@/lib/status-labels";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";

import styles from "./page.module.css";

function fullTime(date: Date) {
  return `${formatChinaDateTime(date)}:${String(date.getUTCSeconds()).padStart(2, "0")}`;
}

export default async function Settings({ searchParams }: { searchParams: Promise<{ tab?: string; q?: string; page?: string; pageSize?: string }> }) {
  const { tab, page: requestedPage, pageSize: requestedSize } = await searchParams;
  const platforms = tab === "platforms";
  try { await requireAdmin(); } catch { redirect("/login"); }
  const [users, credentials, tests] = await Promise.all([
    prisma.appUser.findMany({ select: { id: true, name: true, email: true, role: true, active: true, createdAt: true, lastActiveAt: true }, orderBy: { createdAt: "asc" } }),
    prisma.dataSourceCredential.findMany({ select: { terminal: true, active: true, loginUrl: true, username: true, updatedAt: true } }),
    prisma.etbCredentialTestRun.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  const byTerminal = new Map(credentials.map(item => [item.terminal, item]));
  const terminals = ["盐田", "蛇口", ...credentials.filter(item => !["盐田", "蛇口"].includes(item.terminal)).map(item => item.terminal)];
  const pageSize = [3, 6].includes(Number(requestedSize)) ? Number(requestedSize) : 6;
  const total = platforms ? terminals.length : users.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.max(1, Math.min(totalPages, Number(requestedPage) || 1));
  const start = (currentPage - 1) * pageSize;
  return <>
    <PageHeader title="系统设置" description="管理船期平台账号和业务人员权限。平台密码加密保存，仅管理员可查看。" />
    <PageContainer pagination={<Pagination total={total} currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} pageSizeOptions={[3,6]} href={page => `/settings?tab=${platforms ? "platforms" : "members"}&page=${page}`} label="系统设置分页" />} tabsLabel="设置分类" activeTab={platforms ? "platforms" : "members"} tabs={[{value:"members", label:"账号与权限", href:"/settings"}, {value:"platforms", label:"港口平台配置", href:"/settings?tab=platforms"}]} actions={platforms ? <AddPlatformButton /> : <CreateMemberButton />}>

    {platforms ? <>    <section aria-label="港口平台配置"><p className={styles.platformHint}><span aria-hidden="true" className={styles.infoIcon}>i</span>已接入平台修改后请测试连接。新平台可保存账号并手动登录，自动查询需完成适配。</p><div className={styles.entityGrid}>{terminals.slice(start, start + pageSize).map(terminal => {
      const supported = ["盐田", "蛇口"].includes(terminal);
      const item = byTerminal.get(terminal); const test = tests.find(run => run.terminal === terminal);
      return <EntityCard className={`${styles.entityCard} ${styles.platformCard}`} key={terminal}>
        <header className={styles.sourceHeader}><div className={styles.portTitle}><Avatar className={styles.portIcon}>⚓</Avatar><div><h4>{terminal}{supported ? "港" : ""}</h4><small>{terminal === "盐田" ? "深圳盐田综合保税区平台" : terminal === "蛇口" ? "招商局蛇口港平台互联系统" : "自定义平台 · 自动查询待接入"}</small></div></div><div className={styles.headerActions}><StatusBadge tone={item?.active ? "success" : "muted"}>{item && !item.active ? "已停用" : !supported ? "待接入" : item ? "已配置" : "未配置"}</StatusBadge></div></header>
        <div className={styles.cardBody}><dl className={styles.credentials}>
          <div><dt>平台账号</dt><dd title={item ? `更新时间：${fullTime(item.updatedAt)}` : undefined}>{item?.username || "尚未配置"}</dd></div>
          <div><dt>平台密码</dt><dd>{item ? <ViewCredentialButton key={item.updatedAt.toISOString()} terminal={terminal}/> : "—"}</dd></div>
          <div>
            <dt>连通状态</dt>
            <dd className={styles.connectionStatus} title={test ? fullTime(test.createdAt) : undefined}>
              <span className={styles.testResult} data-status={test?.status || "NONE"}>{test ? `${test.status === "SUCCEEDED" ? "✓" : test.status === "FAILED" ? "✕" : "●"} ${statusLabel(test.status)} (${formatChinaDateTime(test.createdAt).slice(5)})` : "尚无验证记录"}</span>
              {test?.screenshotStorageKey && <>
                <span aria-hidden="true"> · </span>
                <a href={`/api/evidence?key=${encodeURIComponent(test.screenshotStorageKey)}`} target="_blank" rel="noopener noreferrer">查看依据</a>
              </>}
            </dd>
          </div>
        </dl></div>
        <footer className={styles.sourceActions}><div className={styles.footerAction}>{test?.status === "AWAITING_MANUAL" && process.env.ETB_EXECUTION_MODE === "cloud" && <EtbManualControl id={test.id}/>}{item?.loginUrl && <ButtonLink variant="outline" size="small" href={item.loginUrl} target="_blank" rel="noopener noreferrer">打开网站</ButtonLink>}{item && <TogglePlatformButton terminal={terminal} active={item.active} />}{item?.active && supported && <TestCredentialButton terminal={terminal} pending={Boolean(test && ["PENDING", "RUNNING", "AWAITING_MANUAL"].includes(test.status))}/>}<EditCredentialButton terminal={terminal} username={item?.username}/></div></footer>
      </EntityCard>;
    })}</div></section>
</> : <section aria-label="账号与权限">
      <div className={styles.entityGrid}>{users.slice(start, start + pageSize).map(user => <EntityCard className={styles.entityCard} key={user.id}>
        <header className={styles.sourceHeader}><div className={styles.portTitle}><Avatar className={styles.memberAvatar}>{Array.from(user.name)[0] || "用"}</Avatar><h4>{user.name}</h4></div><div className={styles.peopleTags}><span className={styles.roleTag}>{user.role === "ADMIN" ? "管理员" : "业务成员"}</span><StatusBadge tone={user.active ? "success" : "muted"}>{user.active ? "● 启用" : "● 停用"}</StatusBadge></div></header>
        <div className={styles.cardBody}><dl className={styles.credentials}><div><dt>登录邮箱</dt><dd>{user.email}</dd></div><div className={styles.updatedAt}><dt>创建时间</dt><dd>{fullTime(user.createdAt)}</dd></div><div><dt>最近活跃</dt><dd className={styles.timestamp}>{user.lastActiveAt ? fullTime(user.lastActiveAt) : "尚无活跃记录"}</dd></div></dl></div>
        <footer className={styles.peopleFooter}><UserAdminActions id={user.id} active={user.active} name={user.name} email={user.email} role={user.role}/></footer>
      </EntityCard>)}</div>
      {!users.length && <p>暂无成员，请新增成员。</p>}
    </section>}
    </PageContainer>

  </>;
}
