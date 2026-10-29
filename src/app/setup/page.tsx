import { prisma } from "@/lib/prisma";
import { AuthForm } from "@/components/auth-form";
import styles from "../auth-page.module.css";
export default async function Setup() { const hasUser = await prisma.appUser.count() > 0; return <div className={styles.page}><section><p className={styles.eyebrow}>物流调度系统</p><h2>创建管理员账号</h2>{hasUser ? <><p>系统已完成首次设置。</p><a className={styles.link} href="/login">前往登录</a></> : <><p>用于初始化系统。后续可在系统设置中新增其他业务成员。</p><AuthForm mode="setup"/></>}</section></div>; }
