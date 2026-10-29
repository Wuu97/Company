import { sameCarrierName } from "./carrier-name";

export type ShekouQueryConditions = { vesselName?: string; voyage?: string; [key: string]: string | undefined };
export type ShekouScheduleRow = {
  vesselName?: string;
  carrier?: string;
  importVoyage?: string;
  exportVoyage?: string;
  pob?: string;
  etb?: string;
  etd?: string;
  ata?: string;
  atd?: string;
  remark?: string;
  raw: Record<string, string>;
};

export class ShekouManualVerificationRequiredError extends Error {}

export type ShekouClearStrategy = "NONE" | "INPUT_CLEAR_ICON" | "NORMAL_INPUT_CLEAR" | "RESET_FORM";

export function determineShekouClearStrategy(input: { value: string; hasClearIcon: boolean; isReadOnly?: boolean }): ShekouClearStrategy {
  if (!input.value.trim()) return "NONE";
  if (input.hasClearIcon) return "INPUT_CLEAR_ICON";
  if (!input.isReadOnly) return "NORMAL_INPUT_CLEAR";
  return "RESET_FORM";
}

export function assertShekouConditionsCleared(conditions: ShekouQueryConditions) {
  const remaining = Object.entries(conditions).filter(([, value]) => value?.trim());
  if (remaining.length) {
    throw new ShekouManualVerificationRequiredError(`蛇口查询条件未清空：${remaining.map(([key, value]) => `${key}=${value}`).join("；")}。禁止混用新旧条件。`);
  }
}

/** The platform treats case as meaningful, so candidates must match the SO value exactly. */
export function selectExactShekouVessel(candidates: string[], vesselName: string) {
  const matches = candidates.filter(candidate => candidate === vesselName);
  if (matches.length !== 1) throw new ShekouManualVerificationRequiredError(matches.length ? "船名候选重复，需人工核实。" : `未找到与 SO 大小写完全一致的船名：${vesselName}`);
  return matches[0];
}

export function resultFingerprint(rows: ShekouScheduleRow[]) {
  return JSON.stringify(rows.map(row => row.raw));
}

export function assertShekouResultRefreshed(before: string, after: string) {
  if (before === after) throw new ShekouManualVerificationRequiredError("查询结果区域未更新；禁止读取可能遗留的上一笔结果。");
}

export function uniqueExactShekouScheduleMatch(rows: ShekouScheduleRow[], input: { vesselName: string; voyage: string; carrier?: string }) {
  const matches = rows.filter(row => row.vesselName === input.vesselName
    && row.exportVoyage === input.voyage
    && (!input.carrier || !row.carrier || sameCarrierName(row.carrier, input.carrier)));
  if (matches.length !== 1) {
    const reason = matches.length === 0 ? "没有大小写及出口航次完全匹配的结果" : "存在多条完全匹配结果";
    throw new ShekouManualVerificationRequiredError(`${reason}；需人工核实，禁止默认取第一条。`);
  }
  return matches[0];
}
