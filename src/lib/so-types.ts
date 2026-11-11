/** Shared output types for AI SO recognition and persistence. */
export type ContainerSummary = { containerType: string; quantity: number };
export type CargoItemSummary = { description: string; packagesText?: string; weightText?: string; volumeText?: string };

export type ParsedSO = {
  soNumber?: string; carrier?: string; customerReference?: string; vesselName?: string; voyage?: string;
  loadPort?: string; dischargePort?: string; etdText?: string; etaText?: string; etbText?: string; cutoffText?: string;
  siCutoffText?: string; openingText?: string; vgmCutoffText?: string; portCutoffText?: string;
  emptyPickupLocation?: string; fullReturnLocation?: string; transportMode?: string;
  containers: ContainerSummary[]; cargoItems?: CargoItemSummary[]; raw: Record<string, string>;
};
