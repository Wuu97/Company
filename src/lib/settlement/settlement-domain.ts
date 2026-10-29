export const settlementBillTypes = ["DRIVER", "PARTNER", "TEMP_VEHICLE", "CUSTOMER"] as const;
export type SettlementBillType = (typeof settlementBillTypes)[number];

export const billingBases = ["CONTAINER", "TRIP", "LEG", "COMBINATION", "ADHOC"] as const;
export type BillingBasis = (typeof billingBases)[number];

export const combinationKinds = ["SINGLE", "DOUBLE_TRAILER", "SHARED_TRAILER"] as const;
export type CombinationKind = (typeof combinationKinds)[number];

export const feeBearers = ["COMPANY", "DRIVER", "PARTNER", "CUSTOMER", "THIRD_PARTY"] as const;
export type FeeBearer = (typeof feeBearers)[number];

export type Money = string;
export type RateScope = "OBJECT" | "GENERAL";
export type RateVerification = "CONFIRMED" | "UNCONFIRMED";

export type RateFee = {
  code: string;
  amount: Money;
  participatesInSettlement: boolean;
  bearer: FeeBearer;
  includedInBaseRate: boolean;
};

export type RoutePriceRate = {
  id: string;
  billType: SettlementBillType;
  routeCode: string;
  scope: RateScope;
  settlementObjectId?: string;
  factoryId?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  billingBases: readonly BillingBasis[];
  combinations?: readonly CombinationKind[];
  containerTypes?: readonly string[];
  vehicleTypes?: readonly string[];
  unitPrice: Money;
  fees?: readonly RateFee[];
  verification: RateVerification;
};

export type PriceMatchRequest = {
  billType: SettlementBillType;
  routeCode: string;
  businessDate: string;
  settlementObjectId?: string;
  factoryId?: string;
  billingBasis: BillingBasis;
  combination: CombinationKind;
  containerType?: string;
  vehicleType?: string;
};

export type PriceMatchResult =
  | { status: "MATCHED"; rate: RoutePriceRate; matchLevel: "OBJECT" | "GENERAL" }
  | { status: "PRICE_MISSING"; reason: string }
  | { status: "PRICE_CONFLICT"; reason: string; conflictingRateIds: string[] }
  | { status: "UNCONFIRMED_PRICE"; reason: string; candidateRateIds: string[] };

export type SettlementSource = {
  taskId?: string;
  containerId?: string;
  legId?: string;
  tripId?: string;
  combinationId?: string;
  manualChargeId?: string;
};

export type SettlementCalculationInput = {
  billType: SettlementBillType;
  settlementObjectId: string;
  routeCode: string;
  businessDate: string;
  businessAttributionMonth: string;
  settlementMonth: string;
  billingBasis: BillingBasis;
  combination: CombinationKind;
  quantity: Money;
  containerType?: string;
  vehicleType?: string;
  source: SettlementSource;
  manualFees?: readonly RateFee[];
  deductions?: readonly { code: string; amount: Money }[];
};

export type SettlementCalculationResult =
  | { status: "PRICE_MISSING" | "PRICE_CONFLICT" | "UNCONFIRMED_PRICE"; match: PriceMatchResult }
  | {
    status: "CALCULATED";
    match: Extract<PriceMatchResult, { status: "MATCHED" }>;
    baseAmount: Money;
    includedFeeAmount: Money;
    additionalFeeAmount: Money;
    deductionAmount: Money;
    totalAmount: Money;
    feeSnapshot: Array<RateFee & { amount: Money }>;
    settlementUnitKey: string;
  };

export type ExistingSettlementUnit = { settlementUnitKey: string; active: boolean; billLineId: string };

export type DuplicateSettlementResult =
  | { status: "CLEAR"; settlementUnitKey: string }
  | { status: "DUPLICATE"; settlementUnitKey: string; existingBillLineIds: string[] };
