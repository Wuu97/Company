import { ListFilter, FilterField, FilterTextField, FilterActions, FilterClearLink } from "@/components/ui/list";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditCredentialButton, TestCredentialButton, CreateMemberButton, ViewCredentialButton } from "@/components/admin-settings-forms";
import { UserAdminActions } from "@/components/user-admin-actions";
import { statusLabel } from "@/lib/status-labels";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";

import styles from "./page.module.css";

export default async function Settings({ searchParams }: { searchParams: Promise<{ tab?: string; q?: string }> }) {
  const { tab, q = "" } = await searchParams;
  const platforms = tab === "platforms";
  try { await requireAdmin(); } catch { redirect("/login"); }
  const [users, credentials, tests] = await Promise.all([
    prisma.appUser.findMany({ select: { id: true, name: true, email: true, role: true, active: true, createdAt: true }, orderBy: { createdAt: "asc" } }),
    prisma.dataSourceCredential.findMany({ select: { terminal: true, username: true, updatedAt: true } }),
    prisma.etbCredentialTestRun.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  const byTerminal = new Map(credentials.map(item => [item.terminal, item]));
  return <>
    <PageHeader title="系统设置" description="管理船期平台账号和业务人员权限。平台密码加密保存，仅管理员可查看。" />
    <nav className={styles.tabs} aria-label="设置分类"><a href="/settings" aria-current={!platforms ? "page" : undefined}>账号与权限</a><a href="/settings?tab=platforms" aria-current={platforms ? "page" : undefined}>港口平台配置</a></nav>
    {platforms ? <>    <section aria-label="港口平台配置"><p className={styles.platformHint}><span aria-hidden="true" className={styles.infoIcon}>i</span>修改后请点击“测试连接”验证登录状态。</p><div className={styles.sourceList}>{["盐田", "蛇口"].map(terminal => {
      const item = byTerminal.get(terminal); const test = tests.find(run => run.terminal === terminal);
      return <article className={styles.sourceCard} key={terminal}>
        <header className={styles.sourceHeader}><div className={styles.portTitle}><span className={styles.portIcon} aria-hidden="true">⚓</span><div><h4>{terminal}港</h4><small>{terminal === "盐田" ? "深圳盐田综合保税区平台" : "招商局蛇口港平台互联系统"}</small></div></div><div className={styles.headerActions}><StatusBadge tone={item ? "success" : "muted"}>{item ? "已配置" : "未配置"}</StatusBadge></div></header>
        <div className={styles.cardBody}><dl className={styles.credentials}><div><dt>平台账号</dt><dd>{item?.username || "尚未配置"}</dd></div><div><dt>平台密码</dt><dd>{item ? <ViewCredentialButton key={item.updatedAt.toISOString()} terminal={terminal}/> : "—"}</dd></div><div className={styles.updatedAt}><dt>更新时间</dt><dd>{item ? item.updatedAt.toLocaleString("zh-CN") : "—"}</dd></div></dl></div>
        <footer className={styles.sourceActions}><div className={styles.sourceStatus} data-status={test?.status || "NONE"}>{test ? <><span title={test.errorMessage || undefined}>{test.status === "SUCCEEDED" ? "✓" : test.status === "FAILED" ? "✕" : "●"} {statusLabel(test.status)} · {test.createdAt.toLocaleString("zh-CN")}</span>{test.screenshotStorageKey && <ButtonLink variant="text" size="small" href={`/api/evidence?key=${encodeURIComponent(test.screenshotStorageKey)}`} target="_blank" rel="noopener noreferrer">查看依据</ButtonLink>}</> : <span>● 尚无验证记录</span>}</div><div className={styles.footerAction}>{item && <TestCredentialButton terminal={terminal} pending={Boolean(test && ["PENDING", "RUNNING", "AWAITING_MANUAL"].includes(test.status))}/>}<EditCredentialButton terminal={terminal} username={item?.username}/></div></footer>
      </article>;
    })}</div></section>
</> : <section className={styles.members}>
      <div className={styles.memberToolbar}><ListFilter className={styles.memberFilter}><FilterField label="成员姓名 / 邮箱" search><FilterTextField name="q" defaultValue={q} placeholder="搜索成员姓名 / 邮箱" /></FilterField><FilterActions><FilterClearLink href="/settings" /></FilterActions></ListFilter><CreateMemberButton /></div>
      <div className={styles.tableWrap}><table className={styles.memberTable}><thead><tr><th>成员姓名</th><th>登录邮箱</th><th>角色权限</th><th>账号状态</th><th>操作</th></tr></thead><tbody>{users.filter(user => `${user.name} ${user.email}`.toLowerCase().includes(q.trim().toLowerCase())).map(user => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.role === "ADMIN" ? "管理员" : "业务成员"}</td><td><StatusBadge tone={user.active ? "success" : "muted"}>{user.active ? "● 启用" : "● 停用"}</StatusBadge></td><td><UserAdminActions id={user.id} active={user.active}/></td></tr>)}</tbody></table>{!users.some(user => `${user.name} ${user.email}`.toLowerCase().includes(q.trim().toLowerCase())) && <p>未找到匹配成员</p>}</div>
    </section>}
  </>;
}
