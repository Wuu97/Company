type Metric = {
  label: string;
  value: number | string;
  detail: string;
};

export function WorkspaceMetrics({ metrics }: { metrics: readonly Metric[] }) {
  return (
    <dl className="m-0 grid w-full shrink-0 grid-cols-2 border-b border-slate-200/80 lg:grid-cols-4">
      {metrics.map(({ label, value, detail }, index) => (
        <div
          key={label}
          className={`min-w-0 p-3.5 xl:p-4 2xl:p-5 ${index % 2 ? "border-l border-slate-100" : ""} ${index >= 2 ? "border-t border-slate-100 lg:border-t-0" : ""} ${index === 2 ? "lg:border-l" : ""}`}
        >
          <div className="min-w-0" title={detail}>
            <dt className="text-xs font-medium text-slate-500">{label}</dt>
            <dd className="mb-0 ml-0 mt-1 font-mono text-2xl font-bold tabular-nums text-slate-800 2xl:text-[28px]">
              {value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
