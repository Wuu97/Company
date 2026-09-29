import type { EtbQueryResult } from "./etb-query";
import { getEtbSourceConfig } from "./etb-source-config";

export function requiresEtbResultEvidence(source: string) {
  return source.endsWith("_CONTROLLED_BROWSER");
}

export function missingEtbEvidence(results: EtbQueryResult[]) {
  return results.find(result => !result.sourceUrl || !result.screenshotStorageKey);
}

export function invalidEtbEvidence(terminal: string, results: EtbQueryResult[]) {
  const config = getEtbSourceConfig(terminal);
  const sourceHost = new URL(config.homeUrl).hostname;
  return results.find(result => {
    if (!result.sourceUrl || !result.screenshotStorageKey) return true;
    try {
      return new URL(result.sourceUrl).hostname !== sourceHost
        || !/^etb\/.+\.(png|jpe?g|webp)$/i.test(result.screenshotStorageKey);
    } catch { return true; }
  });
}
