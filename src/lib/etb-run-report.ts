import { z } from "zod";

const resultSchema = z.object({
  vessel: z.string(),
  voyage: z.string(),
  soNumbers: z.array(z.string()),
  before: z.string().nullable(),
  after: z.string().nullable(),
  outcome: z.enum(["changed", "first", "same", "unmatched", "no-etb"]),
  screenshotStorageKey: z.string().optional(),
});

export type EtbRunResult = z.infer<typeof resultSchema>;

const reportSchema = z.object({
  resultCount: z.number().int().nonnegative(),
  unmatched: z.number().int().nonnegative(),
  results: z.array(resultSchema).optional(),
});

export function readEtbRunReport(value: unknown) {
  const parsed = reportSchema.safeParse(value);
  if (!parsed.success) return null;
  const { results, resultCount, unmatched } = parsed.data;
  return {
    scanned: resultCount,
    captured: results?.filter((row) => row.after !== null).length ?? null,
    changed: results?.filter((row) => row.outcome === "changed").length ?? null,
    exceptions:
      results?.filter(
        (row) => row.outcome === "unmatched" || row.outcome === "no-etb",
      ).length ?? unmatched,
    results,
  };
}

export const etbOutcomeLabels = {
  changed: "时间变动",
  first: "首次获取",
  same: "时间一致",
  unmatched: "未匹配",
  "no-etb": "未返回 ETB",
} satisfies Record<EtbRunResult["outcome"], string>;
