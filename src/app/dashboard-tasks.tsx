"use client";
import { useState, type ReactNode } from "react";
import styles from "./page.module.css";
type Task = {
  id: string;
  title: string;
  count: number;
  content: ReactNode;
  hint: string;
  empty: string;
};
export function DashboardTasks({ tasks }: { tasks: Task[] }) {
  const [selected, setSelected] = useState(
    () => tasks.find((task) => task.count)?.id ?? tasks[0].id,
  );
  const active = tasks.find((task) => task.id === selected) ?? tasks[0];
  return (
    <div className={styles.taskPanel}>
      <div className={styles.panelHeading}>
        <div>
          <h2>待办处理</h2>
          <p>按业务环节集中处理需要人工确认的事项</p>
        </div>
        <span className={styles.summary}>
          {tasks.some((task) => task.count > 0) ? "有待办需处理" : "全部已处理"}
        </span>
      </div>
      <div className={styles.workspace}>
        <nav className={styles.taskNav} aria-label="待办分类">
          {tasks.map((task, index) => (
            <div key={task.id}>
              {(index === 0 || index === 4) && (
                <p className={styles.groupLabel}>
                  {index === 0 ? "订单准备" : "船期与运输"}
                </p>
              )}
              <button
                type="button"
                className={task.id === active.id ? styles.selected : undefined}
                aria-pressed={task.id === active.id}
                aria-controls="dashboard-task-content"
                onClick={() => setSelected(task.id)}
              >
                <span>{task.title}</span>
                <span className={styles.taskCount}>{task.count}</span>
              </button>
            </div>
          ))}
        </nav>
        <div
          className={styles.taskContent}
          id="dashboard-task-content"
          aria-live="polite"
        >
          {active.count ? (
            active.content
          ) : (
            <section className={styles.emptySection}>
              <h3>{active.title}</h3>
              <p className={styles.taskHint}>{active.hint}</p>
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon} aria-hidden="true">
                  ✓
                </span>
                <strong>{active.empty}</strong>
                <p>有新的待办事项时，会显示在这里。</p>
              </div>
            </section>
          )}
        </div>
      </div>
      <p className={styles.panelFoot}>
        船期、截止时间与派车变更，经人工确认后进入业务安排。
      </p>
    </div>
  );
}
