import { EtbManualControl } from "@/components/etb-manual-control";
import { formatChinaDateTime } from "@/lib/time";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddPlatformButton, EditCredentialButton, TestCredentialButton, CreateMemberButton, ViewCredentialButton } from "@/components/admin-settings-forms";
import { UserAdminActions } from "@/components/user-admin-actions";
import { statusLabel } from "@/lib/status-labels";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";

import styles from "./page.module.css";

export default async function Settings({ searchParams }: { searchParams: Promise<{ tab?: string; q?: string }> }) {
  const { tab } = await searchParams;
  const platforms = tab === "platforms";
  try { await requireAdmin(); } catch { redirect("/login"); }
  const [users, credentials, tests] = await Promise.all([
    prisma.appUser.findMany({ select: { id: true, name: true, email: true, role: true, active: true, createdAt: true, lastActiveAt: true }, orderBy: { createdAt: "asc" } }),
    prisma.dataSourceCredential.findMany({ select: { terminal: true, loginUrl: true, username: true, updatedAt: true } }),
    prisma.etbCredentialTestRun.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  const byTerminal = new Map(credentials.map(item => [item.terminal, item]));
  return <>
    <PageHeader className={styles.settingsHeading} title="系统设置" description="管理船期平台账号和业务人员权限。平台密码加密保存，仅管理员可查看。" />
    <div className={styles.settingsTabBar}><nav className={styles.tabs} aria-label="设置分类"><a href="/settings" aria-current={!platforms ? "page" : undefined}>账号与权限</a><a href="/settings?tab=platforms" aria-current={platforms ? "page" : undefined}>港口平台配置</a></nav>{platforms ? <AddPlatformButton /> : <CreateMemberButton />}</div>
    {platforms ? <>    <section aria-label="港口平台配置"><p className={styles.platformHint}><span aria-hidden="true" className={styles.infoIcon}>i</span>已接入平台修改后请测试连接。新平台可保存账号并手动登录，自动查询需完成适配。</p><div className={styles.sourceList}>{["盐田", "蛇口", ...credentials.filter(item => !["盐田", "蛇口"].includes(item.terminal)).map(item => item.terminal)].map(terminal => {
      const supported = ["盐田", "蛇口"].includes(terminal);
      const item = byTerminal.get(terminal); const test = tests.find(run => run.terminal === terminal);
      return <article className={styles.sourceCard} key={terminal}>
        <header className={styles.sourceHeader}><div className={styles.portTitle}><span className={styles.portIcon} aria-hidden="true">⚓</span><div><h4>{terminal}{supported ? "港" : ""}</h4><small>{terminal === "盐田" ? "深圳盐田综合保税区平台" : terminal === "蛇口" ? "招商局蛇口港平台互联系统" : "自定义平台 · 自动查询待接入"}</small></div></div><div className={styles.headerActions}><StatusBadge tone={item ? "success" : "muted"}>{!supported ? "待接入" : item ? "已配置" : "未配置"}</StatusBadge></div></header>
        <div className={styles.cardBody}><dl className={styles.credentials}><div><dt>平台账号</dt><dd>{item?.username || "尚未配置"}</dd></div><div><dt>平台密码</dt><dd>{item ? <ViewCredentialButton key={item.updatedAt.toISOString()} terminal={terminal}/> : "—"}</dd></div><div className={styles.updatedAt}><dt>更新时间</dt><dd>{item ? item.updatedAt.toLocaleString("zh-CN") : "—"}</dd></div></dl></div>
        <footer className={styles.sourceActions}><div className={styles.sourceStatus} data-status={test?.status || "NONE"}>{test ? <><span title={test.errorMessage || undefined}>{test.status === "SUCCEEDED" ? "✓" : test.status === "FAILED" ? "✕" : "●"} {statusLabel(test.status)} · {test.createdAt.toLocaleString("zh-CN")}</span>{test.screenshotStorageKey && <ButtonLink variant="text" size="small" href={`/api/evidence?key=${encodeURIComponent(test.screenshotStorageKey)}`} target="_blank" rel="noopener noreferrer">查看依据</ButtonLink>}</> : <span>● 尚无验证记录</span>}</div><div className={styles.footerAction}>{test?.status === "AWAITING_MANUAL" && process.env.ETB_EXECUTION_MODE === "cloud" && <EtbManualControl id={test.id}/>}{item?.loginUrl && <ButtonLink variant="outline" size="small" href={item.loginUrl} target="_blank" rel="noopener noreferrer">打开网站</ButtonLink>}{item && supported && <TestCredentialButton terminal={terminal} pending={Boolean(test && ["PENDING", "RUNNING", "AWAITING_MANUAL"].includes(test.status))}/>}<EditCredentialButton terminal={terminal} username={item?.username}/></div></footer>
      </article>;
    })}</div></section>
</> : <section aria-label="账号与权限">
      <div className={styles.sourceList}>{users.map(user => <article className={styles.sourceCard} key={user.id}>
        <header className={styles.sourceHeader}><div className={styles.portTitle}><span className={styles.memberAvatar} aria-hidden="true">{Array.from(user.name)[0] || "用"}</span><h4>{user.name}</h4></div><div className={styles.peopleTags}><span className={styles.roleTag}>{user.role === "ADMIN" ? "管理员" : "业务成员"}</span><StatusBadge tone={user.active ? "success" : "muted"}>{user.active ? "● 启用" : "● 停用"}</StatusBadge></div></header>
        <div className={styles.cardBody}><dl className={styles.credentials}><div><dt>登录邮箱</dt><dd>{user.email}</dd></div><div className={styles.updatedAt}><dt>创建时间</dt><dd>{formatChinaDateTime(user.createdAt)}</dd></div></dl></div>
        <footer className={styles.peopleFooter}><span className={styles.activityHint}>{user.lastActiveAt ? "最近活跃 · " + formatChinaDateTime(user.lastActiveAt) : "尚无活跃记录"}</span><UserAdminActions id={user.id} active={user.active} name={user.name} email={user.email} role={user.role}/></footer>
      </article>)}</div>
      {!users.length && <p>暂无成员，请新增成员。</p>}
    </section>}

  </>;
}
