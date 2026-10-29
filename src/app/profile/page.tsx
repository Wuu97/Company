import { redirect } from "next/navigation";
import businessStyles from "@/components/business.module.css";
import { currentUser } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/change-password-form";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./page.module.css";
export default async function Profile() { const user = await currentUser(); if (!user) redirect("/login"); return <><PageHeader title="个人账户"/><section className={styles.summary}><div><span>姓名</span><b>{user.name}</b></div><div><span>邮箱</span><b>{user.email}</b></div><div><span>账户权限</span><b>{user.role === "ADMIN" ? "管理员" : "业务成员"}</b><small>{user.role === "ADMIN" ? "可管理账号与系统设置" : "可处理日常业务"}</small></div></section><section className={businessStyles["password-section"]}><h3>修改密码</h3><p>修改后，其他设备上的登录会话将自动退出。</p><ChangePasswordForm/></section></>; }
