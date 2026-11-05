import { redirect } from "next/navigation";
import { formatChinaDateTime } from "@/lib/time";
import { currentUser } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/change-password-form";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./page.module.css";
export default async function Profile() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return <div className={styles.page}>
    <PageHeader title="个人账户" />
    <div className={styles.columns}>
    <section className={styles.summary} aria-label="个人资料">
      <div className={styles.avatar} aria-hidden="true">{Array.from(user.name)[0] || "用"}</div>
      <div className={styles.details}>
        <div className={styles.identity}><strong>{user.name}</strong><span className={styles.tag}>{user.role === "ADMIN" ? "管理员" : "业务成员"}</span></div>
        <div className={styles.email}>{user.email}</div>
      </div>
      <dl className={styles.accountMeta}>
        <div><dt>上次使用</dt><dd>{user.lastActiveAt ? formatChinaDateTime(user.lastActiveAt) : "暂无使用记录"}</dd></div>
        <div><dt>账号状态</dt><dd className={user.active ? styles.active : undefined}>{user.active ? "● 正常使用中" : "已停用"}</dd></div>
      </dl>
    </section>
    <section className={styles.passwordSection}>
      <h2>修改密码</h2>
      <div className={styles.alert} role="note"><span aria-hidden="true">ⓘ</span><span>修改后，其他设备上的登录会话将自动退出。</span></div>
      <ChangePasswordForm />
    </section>
    </div>
  </div>;
}
