import { prisma } from "@/lib/prisma";
import { AuthForm } from "@/components/auth-form";
export default async function Login() { const hasUser = await prisma.appUser.count() > 0; return <main className="auth-page"><section><h2>运柜管理</h2>{hasUser ? <><p>请使用业务账号登录。</p><AuthForm mode="login"/></> : <><p>系统尚未初始化。</p><a href="/setup">创建首个家庭账号</a></>}</section></main>; }
