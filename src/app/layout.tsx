import "./styles.css";
import "./dashboard-tailwind.css";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/sidebar";
import type { SidebarItem } from "@/components/sidebar-config";
import styles from "./layout.module.css";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const [unread, contactTasks, etbHandoffs, transportImpacts] = user
    ? await Promise.all([
        prisma.appNotification.count({
          where: { userId: user.id, readAt: null },
        }),
        prisma.customerContactTask.count({ where: { status: "OPEN" } }),
        prisma.etbQueryRun.count({
          where: { status: "AWAITING_MANUAL", manualHandledAt: null },
        }),
        prisma.transportTask.count({ where: { etbImpactNeedsReview: true } }),
      ])
    : [0, 0, 0, 0];
  const items: SidebarItem[] = [
    { group: "工作台", href: "/", label: "工作台" },
    {
      group: "工作台",
      href: "/notifications",
      label: "通知中心",
      count: unread,
    },
    { group: "订单与计划", href: "/orders", label: "SO 订单" },
    { group: "订单与计划", href: "/containers", label: "柜子管理" },
    {
      group: "订单与计划",
      href: "/plans",
      label: "装柜与运输",
      count: transportImpacts,
    },
    { group: "船期", href: "/sailings", label: "船期管理" },
    {
      group: "船期",
      href: "/etb-runs",
      label: "船期更新记录",
      count: etbHandoffs,
    },
    {
      group: "客户协同",
      href: "/contact-tasks",
      label: "客户联系待办",
      count: contactTasks,
    },
    { group: "业务档案", href: "/archives", label: "业务档案" },
    ...(user?.role === "ADMIN"
      ? [
          { group: "财务结算", href: "/finance/bills", label: "账单管理" },
          { group: "财务结算", href: "/finance/routes", label: "路线费用管理" },
        ]
      : []),
    { group: "系统与账户", href: "/logs", label: "操作日志" },
    ...(user
      ? [
          { group: "系统与账户", href: "/profile", label: "个人账户" },
          ...(user.role === "ADMIN"
            ? [{ group: "系统与账户", href: "/settings", label: "系统设置" }]
            : []),
        ]
      : [{ group: "系统与账户", href: "/login", label: "登录" }]),
  ];
  return (
    <html lang="zh-CN">
      <body className={user ? undefined : "unauthenticated"}>
        {user && <Sidebar user={user} items={items} />}
        <main className={styles.main}>
          <div className={styles.content}>{children}</div>
        </main>
      </body>
    </html>
  );
}
