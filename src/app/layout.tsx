import "./styles.css";
import businessStyles from "@/components/business.module.css";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";
import { SidebarNav } from "@/components/sidebar-nav";
import styles from "./layout.module.css";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const [unread, contactTasks, etbHandoffs, transportImpacts] = user ? await Promise.all([
    prisma.appNotification.count({ where: { userId: user.id, readAt: null } }),
    prisma.customerContactTask.count({ where: { status: "OPEN" } }),
    prisma.etbQueryRun.count({ where: { status: "AWAITING_MANUAL", manualHandledAt: null } }),
    prisma.transportTask.count({ where: { etbImpactNeedsReview: true } }),
  ]) : [0, 0, 0, 0];
  const items = [
    { group: "工作台", href: "/", label: "工作台" },
    { group: "工作台", href: "/notifications", label: "通知中心", count: unread },
    { group: "订单与计划", href: "/orders", label: "SO 订单" },
    { group: "订单与计划", href: "/containers", label: "柜子管理" },
    { group: "订单与计划", href: "/plans", label: "装柜与运输", count: transportImpacts },
    { group: "船期", href: "/sailings", label: "船期管理" },
    { group: "船期", href: "/etb-runs", label: "船期更新记录", count: etbHandoffs },
    { group: "客户协同", href: "/contact-tasks", label: "客户联系待办", count: contactTasks },
    { group: "业务档案", href: "/customers", label: "客户与工厂" },
    { group: "业务档案", href: "/drivers", label: "司机档案" },
    { group: "业务档案", href: "/fleet-owners", label: "合作车资料" },
    { group: "业务档案", href: "/temporary-vehicles", label: "临时车资料" },
    ...(user?.role === "ADMIN" ? [{ group: "财务结算", href: "/finance/bills", label: "账单管理" }, { group: "财务结算", href: "/finance/routes", label: "路线费用管理" }] : []),
    { group: "系统与账户", href: "/logs", label: "操作日志" },
    ...(user ? [{ group: "系统与账户", href: "/profile", label: "个人账户" }, ...(user.role === "ADMIN" ? [{ group: "系统与账户", href: "/settings", label: "系统设置" }] : [])] : [{ group: "系统与账户", href: "/login", label: "登录" }]),
  ];
  return <html lang="zh-CN"><body className={user ? undefined : "unauthenticated"}>{user && <aside><h1>运柜管理</h1><p className={businessStyles["signed-in"]}>{user.name} · {user.role === "ADMIN" ? "负责人" : "成员"}</p><SidebarNav items={items}/><LogoutButton/></aside>}<main className={styles.main}><div className={styles.content}>{children}</div></main></body></html>;
}
