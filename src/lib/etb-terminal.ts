/** A sailing may be tracked even when it has no automated ETB data source. */
export type EtbTerminal = "盐田" | "蛇口" | "大铲湾";

/** Infer the sailing terminal from an SO loading-port name or UN/LOCODE. */
export function inferEtbTerminal(loadPort: string | null | undefined): EtbTerminal | undefined {
  const value = (loadPort ?? "").toUpperCase();
  if (/DA\s*CHAN\s*BAY|大铲湾|CNDCH/.test(value)) return "大铲湾";
  if (/SHEKOU|蛇口|CNSHK/.test(value)) return "蛇口";
  if (/YANTIAN|盐田|CNYTN/.test(value)) return "盐田";
  return undefined;
}
