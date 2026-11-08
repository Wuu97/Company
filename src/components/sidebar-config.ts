export type SidebarItem = {
  group: string;
  href: string;
  label: string;
  count?: number;
};
export type SidebarIcon =
  | "dashboard"
  | "orders"
  | "sailings"
  | "customers"
  | "archives"
  | "finance"
  | "settings";
export type SidebarGroup = { label: string; icon: SidebarIcon };
export type SidebarSection = { label: string; groups: readonly SidebarGroup[] };

/** Route entries and permission-filtered counts are supplied by the server layout. */
export const sidebarSections: readonly SidebarSection[] = [
  {
    label: "核心业务",
    groups: [
      { label: "工作台", icon: "dashboard" },
      { label: "订单与计划", icon: "orders" },
      { label: "船期", icon: "sailings" },
      { label: "客户协同", icon: "customers" },
    ],
  },
  {
    label: "数据与管理",
    groups: [
      { label: "业务档案", icon: "archives" },
      { label: "财务结算", icon: "finance" },
      { label: "系统与账户", icon: "settings" },
    ],
  },
];
export function isSidebarRouteActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
