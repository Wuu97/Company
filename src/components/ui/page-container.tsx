import type { ReactNode } from "react";
import { NavTabs } from "./nav-tabs";
import styles from "./page-container.module.css";

export type PageTab = {
  label: ReactNode;
  value?: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
};
export type PageContainerProps = {
  tabs?: PageTab[];
  activeTab?: string;
  tabsLabel?: string;
  actions?: ReactNode;
  filter?: ReactNode;
  pagination?: ReactNode;
  children: ReactNode;
};
/** The single content surface beneath PageHeader on business pages. */
export function PageContainer({ tabs, activeTab, tabsLabel = "页面分类", actions, filter, pagination, children }: PageContainerProps) {
  return <div data-page-card className={[styles.card, tabs?.length ? styles.hasTabs : undefined].filter(Boolean).join(" ")}>
    {tabs?.length ? <>
      <div className={styles.header}>
        <NavTabs label={tabsLabel} items={tabs.map(tab => ({ ...tab, active: activeTab === undefined ? tab.active : tab.value === activeTab }))} />
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {filter && <div className={styles.filter}>{filter}</div>}
    </> : (filter || actions) ? <div className={styles.inlineToolbar}>
      {filter && <div className={styles.inlineFilter}>{filter}</div>}
      {actions && <div className={styles.inlineActions}>{actions}</div>}
    </div> : null}
    <div className={styles.content}>{children}</div>
    {pagination && <div className={styles.pagination}>{pagination}</div>}
  </div>;
}
