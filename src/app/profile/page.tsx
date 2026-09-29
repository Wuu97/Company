import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/change-password-form";
export default async function Profile() { const user = await currentUser(); if (!user) redirect("/login"); return <><h2>个人账户</h2><section><p><b>姓名：</b>{user.name}</p><p><b>邮箱：</b>{user.email}</p><p><b>角色：</b>{user.role === "ADMIN" ? "管理员（账号与系统维护）" : "业务成员（日常业务操作）"}</p></section><section><h3>修改密码</h3><p>修改后，其他设备上的登录会话将自动退出。</p><ChangePasswordForm/></section></>; }
