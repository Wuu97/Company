import type { Prisma, PrismaClient } from "@prisma/client";
import { calculateSettlementLine, settlementUnitKey } from "./settlement-pricing";
import { matchRoutePriceFromDatabase } from "./route-price-repository";
import type { BillingBasis, CombinationKind, SettlementBillType } from "./settlement-domain";

type Db = PrismaClient | Prisma.TransactionClient;
export type BillLineInput = { billId: string; transportTaskId: string; transportLegId: string; billingBasis: BillingBasis; combination: CombinationKind; quantity: string; containerUnitId?: string; transportBillingGroupId?: string; manualFees?: Array<{ code: string; amount: string; participatesInSettlement: boolean; bearer: "COMPANY" | "DRIVER" | "PARTNER" | "CUSTOMER" | "THIRD_PARTY"; includedInBaseRate: boolean }>; deductions?: Array<{ code: string; amount: string }> };

function month(d: Date) { return d.toISOString().slice(0, 7); }
function objectId(bill: { billType: SettlementBillType; driverId: string | null; fleetOwnerId: string | null; customerId: string | null }) {
  const id = bill.billType === "DRIVER" ? bill.driverId : bill.billType === "PARTNER" ? bill.fleetOwnerId : bill.customerId;
  if (!id) throw new Error("账单缺少结算对象");
  return id;
}

/** Adds one immutable, price-snapshotted line. Only completed task legs can settle. */
export async function addSettlementLine(db: Db, input: BillLineInput) {
  const bill = await db.settlementBill.findUnique({ where: { id: input.billId } });
  if (!bill) throw new Error("账单不存在");
  if (!["DRAFT", "ADJUSTED"].includes(bill.confirmationStatus)) throw new Error("已提交或确认的账单不能新增明细");
  const leg = await db.transportLeg.findFirst({
    where: { id: input.transportLegId, transportTaskId: input.transportTaskId },
    include: {
      transportTask: { include: { loadingPlan: { include: { soOrder: true, items: { where: { active: true }, include: { containerUnit: true } } } } } },
      route: true,
      vehicle: true,
    },
  });
  if (!leg?.route || leg.status !== "COMPLETED" || leg.transportTask.status !== "COMPLETED") throw new Error("仅已完成且已绑定路线的运输段可进入结算");
  const settlementObjectId = objectId(bill);
  if (bill.billType === "DRIVER" && leg.driverId !== settlementObjectId) throw new Error("运输段司机与工资账单对象不一致");
  if (bill.billType === "PARTNER" && (leg.fleetOwnerId !== settlementObjectId || leg.settlementCarrierType !== "PARTNER_MONTHLY")) throw new Error("仅合作车月结运输段可进入该合作车账单");
  if (bill.billType === "CUSTOMER" && leg.transportTask.loadingPlan.soOrder.customerId !== settlementObjectId) throw new Error("运输任务客户与对账单对象不一致");
  const businessDate = leg.actualReturnAt || leg.actualFactoryArrivedAt || leg.transportTask.completedAt || leg.transportTask.scheduledAt;
  const containers = leg.transportTask.loadingPlan.items.map(item => item.containerUnit);
  const container = input.containerUnitId ? containers.find(value => value.id === input.containerUnitId) : undefined;
  if (input.billingBasis === "CONTAINER" && !container) throw new Error("按柜结算必须选择该运输任务的有效柜子");
  const calc = calculateSettlementLine([], { billType: bill.billType, settlementObjectId, routeCode: leg.route.code, businessDate: businessDate.toISOString().slice(0, 10), businessAttributionMonth: month(businessDate), settlementMonth: bill.settlementMonth, billingBasis: input.billingBasis, combination: input.combination, quantity: input.quantity, containerType: container?.containerType, vehicleType: leg.vehicle?.vehicleType || undefined, source: { taskId: input.transportTaskId, legId: input.transportLegId, containerId: input.containerUnitId, tripId: input.transportTaskId, combinationId: input.transportBillingGroupId }, manualFees: input.manualFees, deductions: input.deductions });
  // Resolve from the database separately so rate dates, scopes and dimensions are never inferred from the UI.
  const match = await matchRoutePriceFromDatabase(db as PrismaClient, { billType: bill.billType, settlementObjectId, factoryId: leg.transportTask.loadingPlan.factoryId, routeCode: leg.route.code, businessDate: businessDate.toISOString().slice(0, 10), billingBasis: input.billingBasis, combination: input.combination, containerType: container?.containerType, vehicleType: leg.vehicle?.vehicleType || undefined });
  if (match.status !== "MATCHED") throw new Error(match.reason || "路线价格未配置或存在冲突");
  const priced = calculateSettlementLine([match.rate], { billType: bill.billType, settlementObjectId, routeCode: leg.route.code, businessDate: businessDate.toISOString().slice(0, 10), businessAttributionMonth: month(businessDate), settlementMonth: bill.settlementMonth, billingBasis: input.billingBasis, combination: input.combination, quantity: input.quantity, containerType: container?.containerType, vehicleType: leg.vehicle?.vehicleType || undefined, source: { taskId: input.transportTaskId, legId: input.transportLegId, containerId: input.containerUnitId, tripId: input.transportTaskId, combinationId: input.transportBillingGroupId }, manualFees: input.manualFees, deductions: input.deductions });
  if (priced.status !== "CALCULATED") throw new Error("路线价格无法计算");
  const key = settlementUnitKey({ billType: bill.billType, settlementObjectId, routeCode: leg.route.code, businessDate: businessDate.toISOString().slice(0, 10), businessAttributionMonth: month(businessDate), settlementMonth: bill.settlementMonth, billingBasis: input.billingBasis, combination: input.combination, quantity: input.quantity, source: { taskId: input.transportTaskId, legId: input.transportLegId, containerId: input.containerUnitId, tripId: input.transportTaskId, combinationId: input.transportBillingGroupId } });
  const existing = await db.settlementUnitClaim.findFirst({ where: { settlementUnitKey: key, billType: bill.billType, settlementObjectKey: settlementObjectId, releasedAt: null } });
  if (existing) throw new Error("该运输计费单元已在另一张有效账单中，不能重复入账");
  const priceSnapshot = { rate: match.rate, baseAmount: priced.baseAmount, additionalFeeAmount: priced.additionalFeeAmount, deductionAmount: priced.deductionAmount, fees: priced.feeSnapshot, deductions: input.deductions || [], matchedAt: new Date().toISOString() };
  const line = await db.settlementLine.create({ data: { billId: bill.id, billType: bill.billType, routeId: leg.route.id, transportTaskId: leg.transportTaskId, transportLegId: leg.id, containerUnitId: input.containerUnitId || null, transportBillingGroupId: input.transportBillingGroupId || null, billingBasis: input.billingBasis, combination: input.combination, businessDate, completionMonth: month(businessDate), businessAttributionMonth: month(businessDate), settlementMonth: bill.settlementMonth, quantity: input.quantity, unitPriceSnapshot: match.rate.unitPrice, amountSnapshot: priced.totalAmount, priceSnapshot: priceSnapshot as Prisma.InputJsonValue, settlementUnitKey: key, containerSources: { create: container ? [{ containerUnitId: container.id }] : [] } } });
  await db.settlementUnitClaim.create({ data: { settlementUnitKey: key, billType: bill.billType, settlementObjectKey: settlementObjectId, lineId: line.id } });
  const totals = await db.settlementLine.aggregate({ where: { billId: bill.id }, _sum: { amountSnapshot: true } });
  await db.settlementBill.update({ where: { id: bill.id }, data: { totalAmount: totals._sum.amountSnapshot || "0" } });
  return line;
}
