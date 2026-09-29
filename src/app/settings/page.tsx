import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CredentialForm, TestCredentialButton, UserCreateForm } from "@/components/admin-settings-forms";
import { UserAdminActions } from "@/components/user-admin-actions";

export default async function Settings() {
  try { await requireAdmin(); } catch { redirect("/login"); }
  const [users, credentials, tests] = await Promise.all([prisma.appUser.findMany({ select: { id: true, name: true, email: true, role: true, active: true, createdAt: true }, orderBy: { createdAt: "asc" } }), prisma.dataSourceCredential.findMany({ select: { terminal: true, username: true, updatedAt: true } }), prisma.etbCredentialTestRun.findMany({ orderBy: { createdAt: "desc" }, take: 50 })]);
  const byTerminal = new Map(credentials.map(item => [item.terminal, item]));
  return <><h2>系统设置</h2><section><h3>ETB 平台账号</h3><p>密码经服务器加密保存，不可再次查看。机器人验证仍需在受控 Worker 内人工完成。</p>{["盐田", "蛇口"].map(terminal => { const item = byTerminal.get(terminal); const test = tests.find(run => run.terminal === terminal); return <div className="settings-source" key={terminal}><h4>{terminal}</h4><p>{item ? `已配置账号：${item.username}；更新于 ${item.updatedAt.toLocaleString("zh-CN")}` : "尚未配置"}</p><CredentialForm terminal={terminal} username={item?.username}/>{item && <><TestCredentialButton terminal={terminal}/><p>最近测试：{test ? <>{test.status}{test.errorMessage ? ` · ${test.errorMessage}` : ""}{test.screenshotStorageKey ? <> · <a href={`/api/evidence?key=${encodeURIComponent(test.screenshotStorageKey)}`} target="_blank" rel="noreferrer">查看截图</a></> : null}</> : "尚无"}</p></>}</div>; })}</section><section><h3>家庭成员</h3><p>记录标签只用于操作日志显示，所有已登录成员均可使用系统功能。</p><UserCreateForm/><table><thead><tr><th>姓名</th><th>邮箱</th><th>记录标签</th><th>状态</th><th>管理</th></tr></thead><tbody>{users.map(user => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.role === "ADMIN" ? "负责人" : "成员"}</td><td>{user.active ? "启用" : "停用"}</td><td><UserAdminActions id={user.id} active={user.active}/></td></tr>)}</tbody></table></section></>;
}
