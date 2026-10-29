import { inferEtbTerminal } from "./etb-terminal";

export type EtbAutoLinkInput = {
  carrier?: string | null;
  vesselName?: string | null;
  voyage?: string | null;
  loadPort?: string | null;
  fullReturnLocation?: string | null;
  parseReview?: { needsReview?: boolean } | null;
};

/** Only link a reviewed SO automatically when its parser marked the core route unambiguous. */
export function etbAutoLinkEligibility(input: EtbAutoLinkInput) {
  if (input.parseReview?.needsReview !== false) return { eligible: false as const, reason: "解析结果仍需人工复核" };
  if (!input.carrier || !input.vesselName || !input.voyage || !input.loadPort) return { eligible: false as const, reason: "SO 缺少船公司、船名、航次或装货港" };
  // ETB is queried from the terminal that receives the full container.  The
  // loading port is only a fallback when the SO has no usable return location.
  const terminal = inferEtbTerminal(input.fullReturnLocation) ?? inferEtbTerminal(input.loadPort);
  if (!terminal) return { eligible: false as const, reason: `无法从还柜地点或装货港识别 ETB 码头：${input.fullReturnLocation || input.loadPort}` };
  return { eligible: true as const, terminal };
}
