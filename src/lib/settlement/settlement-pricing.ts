import type {
  DuplicateSettlementResult,
  ExistingSettlementUnit,
  Money,
  PriceMatchRequest,
  PriceMatchResult,
  RateFee,
  RoutePriceRate,
  SettlementCalculationInput,
  SettlementCalculationResult,
} from "./settlement-domain";

const SCALE = 100n;
const moneyPattern = /^-?\d+(?:\.\d{1,2})?$/;

function toCents(value: Money): bigint {
  if (!moneyPattern.test(value)) throw new Error(`金额必须为最多两位小数的字符串：${value}`);
  const negative = value.startsWith("-");
  const [whole, decimal = ""] = (negative ? value.slice(1) : value).split(".");
  const cents = BigInt(whole) * SCALE + BigInt((decimal + "00").slice(0, 2));
  return negative ? -cents : cents;
}

function centsToMoney(value: bigint): Money {
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  return `${negative ? "-" : ""}${absolute / SCALE}.${String(absolute % SCALE).padStart(2, "0")}`;
}

function multiplyMoney(amount: Money, quantity: Money): Money {
  const amountCents = toCents(amount);
  if (!moneyPattern.test(quantity)) throw new Error(`数量必须为最多两位小数的字符串：${quantity}`);
  const quantityHundredths = toCents(quantity);
  const result = amountCents * quantityHundredths;
  if (result % SCALE !== 0n) throw new Error("金额与数量相乘后超过两位小数，需先定义舍入规则");
  return centsToMoney(result / SCALE);
}

function addMoney(values: readonly Money[]): Money {
  return centsToMoney(values.reduce((total, value) => total + toCents(value), 0n));
}

function inDateRange(date: string, rate: RoutePriceRate) {
  return date >= rate.effectiveFrom && (!rate.effectiveTo || date <= rate.effectiveTo);
}

function matchesDimension(value: string | undefined, accepted: readonly string[] | undefined) {
  return !accepted?.length || Boolean(value && accepted.includes(value));
}

function isEligible(rate: RoutePriceRate, request: PriceMatchRequest) {
  return rate.billType === request.billType
    && rate.routeCode === request.routeCode
    && inDateRange(request.businessDate, rate)
    && rate.billingBases.includes(request.billingBasis)
    && (!rate.factoryId || rate.factoryId === request.factoryId)
    && (!rate.combinations?.length || rate.combinations.includes(request.combination))
    && matchesDimension(request.containerType, rate.containerTypes)
    && matchesDimension(request.vehicleType, rate.vehicleTypes);
}

function resolveCandidates(rates: readonly RoutePriceRate[], request: PriceMatchRequest) {
  const eligible = rates.filter(rate => isEligible(rate, request));
  const objectRates = request.settlementObjectId
    ? eligible.filter(rate => rate.scope === "OBJECT" && rate.settlementObjectId === request.settlementObjectId)
    : [];
  if (objectRates.length) return objectRates;
  const factoryRates = request.factoryId ? eligible.filter(rate => rate.scope === "GENERAL" && rate.factoryId === request.factoryId) : [];
  return factoryRates.length ? factoryRates : eligible.filter(rate => rate.scope === "GENERAL" && !rate.factoryId);
}

export function matchRoutePrice(rates: readonly RoutePriceRate[], request: PriceMatchRequest): PriceMatchResult {
  const candidates = resolveCandidates(rates, request);
  const confirmed = candidates.filter(rate => rate.verification === "CONFIRMED");
  if (confirmed.length > 1) return { status: "PRICE_CONFLICT", reason: "同一优先级存在多条有效且已确认的路线价格", conflictingRateIds: confirmed.map(rate => rate.id) };
  if (confirmed.length === 1) return { status: "MATCHED", rate: confirmed[0], matchLevel: confirmed[0].scope };
  if (candidates.length) return { status: "UNCONFIRMED_PRICE", reason: "仅匹配到未确认的候选价格，不能用于正式结算", candidateRateIds: candidates.map(rate => rate.id) };
  return { status: "PRICE_MISSING", reason: "未找到满足路线、业务日期、结算对象、计费单位和适用条件的有效价格" };
}

export function settlementUnitKey(input: SettlementCalculationInput): string {
  // Months are presentation/settlement attributes and can be corrected later;
  // they must never become part of the stable business-unit identity.
  const base = [input.billType, input.settlementObjectId, input.billingBasis];
  const source = input.source;
  if (input.billingBasis === "CONTAINER" && source.taskId && source.containerId) return [...base, source.taskId, source.containerId].join(":");
  if (input.billingBasis === "TRIP" && source.taskId && source.tripId) return [...base, source.taskId, source.tripId].join(":");
  if (input.billingBasis === "LEG" && source.taskId && source.legId) return [...base, source.taskId, source.legId].join(":");
  if (input.billingBasis === "COMBINATION" && source.taskId && source.combinationId) return [...base, input.combination, source.taskId, source.combinationId].join(":");
  if (input.billingBasis === "ADHOC" && source.manualChargeId) return [...base, source.manualChargeId].join(":");
  throw new Error(`计费单位 ${input.billingBasis} 缺少可审计的业务来源标识`);
}

export function findDuplicateSettlement(input: SettlementCalculationInput, existing: readonly ExistingSettlementUnit[]): DuplicateSettlementResult {
  const key = settlementUnitKey(input);
  const existingBillLineIds = existing.filter(item => item.active && item.settlementUnitKey === key).map(item => item.billLineId);
  return existingBillLineIds.length ? { status: "DUPLICATE", settlementUnitKey: key, existingBillLineIds } : { status: "CLEAR", settlementUnitKey: key };
}

function includedFees(fees: readonly RateFee[]) {
  return fees.filter(fee => fee.participatesInSettlement && !fee.includedInBaseRate);
}

export function calculateSettlementLine(rates: readonly RoutePriceRate[], input: SettlementCalculationInput): SettlementCalculationResult {
  const match = matchRoutePrice(rates, input);
  if (match.status !== "MATCHED") return { status: match.status, match };
  const rateFees = includedFees(match.rate.fees || []);
  const manualFees = includedFees(input.manualFees || []);
  const feeSnapshot = [...rateFees, ...manualFees].map(fee => ({ ...fee }));
  const baseAmount = multiplyMoney(match.rate.unitPrice, input.quantity);
  const additionalFeeAmount = addMoney(feeSnapshot.map(fee => fee.amount));
  const deductionAmount = addMoney((input.deductions || []).map(item => item.amount));
  const totalAmount = centsToMoney(toCents(baseAmount) + toCents(additionalFeeAmount) - toCents(deductionAmount));
  return {
    status: "CALCULATED",
    match,
    baseAmount,
    includedFeeAmount: addMoney((match.rate.fees || []).filter(fee => fee.includedInBaseRate).map(fee => fee.amount)),
    additionalFeeAmount,
    deductionAmount,
    totalAmount,
    feeSnapshot,
    settlementUnitKey: settlementUnitKey(input),
  };
}
