export const archiveTabs = [
  { value: "drivers", label: "司机档案" },
  { value: "contract_trucks", label: "合作车资料" },
  { value: "temporary_trucks", label: "临时车资料" },
  { value: "customers", label: "客户与工厂" },
] as const;
export type ArchiveTab = (typeof archiveTabs)[number]["value"];
export function getArchiveTab(value?: string): ArchiveTab {
  return (
    archiveTabs.find((tab) => tab.value === value)?.value ??
    archiveTabs[0].value
  );
}
