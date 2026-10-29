import { redirect } from "next/navigation";
import businessStyles from "@/components/business.module.css";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CredentialForm, TestCredentialButton, UserCreateForm } from "@/components/admin-settings-forms";
import { UserAdminActions } from "@/components/user-admin-actions";
import { statusLabel, statusTone } from "@/lib/status-labels";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import styles from "./page.module.css";

function credentialTestHint(status: string) {
  return ({ SUCCEEDED: "登录验证通过，可用于后续船期更新。", FAILED: "最近验证未通过，请核对账号后再次验证。", AWAITING_MANUAL: "需要人工协助后才能继续验证。", QUEUED: "验证已安排，结果稍后更新。", RUNNING: "正在验证登录信息。" } as Record<string, string>)[status] || "验证结果已记录，可按需再次验证。";
}

export default async function Settings() {
  try { await requireAdmin(); } catch { redirect("/login"); }
  const [users, credentials, tests] = await Promise.all([
    prisma.appUser.findMany({ select: { id: true, name: true, email: true, role: true, active: true, createdAt: true }, orderBy: { createdAt: "asc" } }),
    prisma.dataSourceCredential.findMany({ select: { terminal: true, username: true, updatedAt: true } }),
    prisma.etbCredentialTestRun.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  const byTerminal = new Map(credentials.map(item => [item.terminal, item]));
  return <>
    <PageHeader title="系统设置" description="管理船期平台账号和业务人员权限。平台密码会安全保存，保存后不可再次查看。" />
    <section><h3>船期平台配置</h3><p className={businessStyles["muted"]}>如平台需要人工验证，会在船期更新记录中提示处理；不会影响已经确认的业务时间。</p><div className={styles.sourceList}>{["盐田", "蛇口"].map(terminal => {
      const item = byTerminal.get(terminal); const test = tests.find(run => run.terminal === terminal);
      return <article className={styles.sourceCard} key={terminal}><div className={styles.sourceHeader}><div><span>平台</span><h4>{terminal}</h4></div><StatusBadge tone={item ? "success" : "muted"}>{item ? "已配置" : "待配置"}</StatusBadge></div><p>{item ? <>使用账号：<b>{item.username}</b><br/><small>上次更新：{item.updatedAt.toLocaleString("zh-CN")}</small></> : "尚未配置平台账号。"}</p><CredentialForm terminal={terminal} username={item?.username}/>{item && <div className={styles.sourceTest}><TestCredentialButton terminal={terminal}/><p>最近验证：{test ? <><StatusBadge tone={statusTone(test.status)} size="small">{statusLabel(test.status)}</StatusBadge> · {test.createdAt.toLocaleString("zh-CN")}<br/><small>{credentialTestHint(test.status)}</small>{test.screenshotStorageKey && <><br/><ButtonLink variant="secondary" size="small" href={`/api/evidence?key=${encodeURIComponent(test.screenshotStorageKey)}`} target="_blank" rel="noopener noreferrer">查看依据</ButtonLink></>}</> : "尚无验证记录；建议保存账号后先验证登录。"}</p></div>}</article>;
    })}</div></section>
    <section><h3>账号与权限</h3><p className={businessStyles["muted"]}>管理员可管理账号和系统设置；业务成员可处理 SO、计划和运输等日常业务。</p><UserCreateForm/><div className={styles.userList}>{users.map(user => <article className={styles.userCard} key={user.id}><div><span>姓名</span><b>{user.name}</b><small>{user.email}</small></div><div><span>权限</span><b>{user.role === "ADMIN" ? "管理员" : "业务成员"}</b></div><div><span>状态</span><StatusBadge tone={user.active ? "success" : "muted"}>{user.active ? "启用" : "停用"}</StatusBadge></div><div className={styles.userAction}><UserAdminActions id={user.id} active={user.active}/></div></article>)}</div></section>
  </>;
}
