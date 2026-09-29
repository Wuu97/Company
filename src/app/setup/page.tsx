import { prisma } from "@/lib/prisma";
import { AuthForm } from "@/components/auth-form";
export default async function Setup() { const hasUser = await prisma.appUser.count() > 0; return <main className="auth-page"><section><h2>首次设置</h2>{hasUser ? <><p>首个家庭账号已创建。</p><a href="/login">前往登录</a></> : <><p>创建首个家庭账号。后续可在系统设置中新增其他家庭成员。</p><AuthForm mode="setup"/></>}</section></main>; }
