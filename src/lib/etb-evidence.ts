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
  const sourceHosts = new Set([new URL(config.homeUrl).hostname, ...(config.allowedEvidenceHosts || [])]);
  return results.find(result => {
    if (!result.sourceUrl || !result.screenshotStorageKey) return true;
    try {
      return !sourceHosts.has(new URL(result.sourceUrl).hostname)
        || !/^etb\/.+\.(png|jpe?g|webp)$/i.test(result.screenshotStorageKey);
    } catch { return true; }
  });
}
