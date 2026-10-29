import { prisma } from "@/lib/prisma";
import { AuthForm } from "@/components/auth-form";
import styles from "../auth-page.module.css";
export default async function Login() { const hasUser = await prisma.appUser.count() > 0; return <div className={styles.page}><section><p className={styles.eyebrow}>物流调度系统</p><h2>欢迎回来</h2>{hasUser ? <><p>请使用业务账号登录。</p><AuthForm mode="login"/></> : <><p>系统尚未初始化。</p><a className={styles.link} href="/setup">创建首个管理员账号</a></>}</section></div>; }
