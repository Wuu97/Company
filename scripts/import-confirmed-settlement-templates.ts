import { PrismaClient, BillingBasis, BillingCombination, RoutePriceScope, RoutePriceStatus, RouteType, SettlementBillType } from "@prisma/client";

const prisma = new PrismaClient();

type RouteTemplate = { name: string; containerTypes: string[]; kilometers?: string; toll?: string; fuel?: string };

const routes: RouteTemplate[] = [
  { name: "宝安-新兴-盐田", containerTypes: ["40HQ"], kilometers: "600", toll: "320", fuel: "1085.76" },
  { name: "横岗-新兴-盐田", containerTypes: ["40GP", "40HQ"], kilometers: "600", toll: "320", fuel: "1085.76" },
  { name: "盐田-新兴-盐田", containerTypes: ["20GP", "40GP", "40HQ"], kilometers: "600", toll: "320", fuel: "1085.76" },
  { name: "蛇口-新兴-盐田", containerTypes: ["40GP", "40HQ"], kilometers: "600", toll: "320", fuel: "1085.76" },
  { name: "蛇口-新兴-蛇口", containerTypes: ["20GP", "40GP", "40HQ"], kilometers: "597", toll: "320", fuel: "1141.94" },
  { name: "宝安-新兴-蛇口", containerTypes: ["40HQ"] },
  { name: "福永-新兴-盐田", containerTypes: ["40GP"] },
  { name: "东莞-鹤山-盐田", containerTypes: ["40HQ"] },
  { name: "盐田-鹤山-盐田", containerTypes: ["40GP", "40HQ"], kilometers: "450", toll: "320", fuel: "928.80" },
];

const customers = [
  { code: "DENAS", name: "广东德纳斯金属制品有限公司", factoryName: "德纳斯" },
  { code: "OUYA", name: "新兴县欧亚不锈钢制品有限公司", factoryName: "新兴欧亚" },
  { code: "WANSHITAI", name: "万事泰", factoryName: "万事泰" },
  { code: "HESHAN", name: "鹤山共和镇", factoryName: "鹤山共和镇" },
];

const customerPrices = [
  ["DENAS", "宝安-新兴-盐田", "40HQ", "2900"], ["DENAS", "横岗-新兴-盐田", "40GP", "2900"], ["DENAS", "横岗-新兴-盐田", "40HQ", "2900"],
  ["DENAS", "盐田-新兴-盐田", "20GP", "2900"], ["DENAS", "盐田-新兴-盐田", "40HQ", "2900"], ["DENAS", "蛇口-新兴-盐田", "40GP", "2900"],
  ["DENAS", "蛇口-新兴-蛇口", "20GP", "2900"], ["DENAS", "蛇口-新兴-蛇口", "40GP", "2900"], ["DENAS", "蛇口-新兴-蛇口", "40HQ", "2900"],
  ["OUYA", "横岗-新兴-盐田", "40HQ", "3000"], ["OUYA", "盐田-新兴-盐田", "40HQ", "3000"], ["OUYA", "福永-新兴-盐田", "40GP", "3000"], ["OUYA", "蛇口-新兴-蛇口", "40HQ", "3000"],
] as const;

const driverPrices = [
  ["WANSHITAI", "盐田-新兴-盐田", "40HQ", "2350"], ["DENAS", "盐田-新兴-盐田", "40HQ", "2500"], ["OUYA", "盐田-新兴-盐田", "40HQ", "2500"],
  ["HESHAN", "东莞-鹤山-盐田", "40HQ", "2000"], ["HESHAN", "盐田-鹤山-盐田", "40GP", "2000"], ["HESHAN", "盐田-鹤山-盐田", "40HQ", "2000"],
] as const;

const codeFor = (name: string) => `HIST-${name.replace(/-/g, "-").replace(/新兴/g, "XX").replace(/盐田/g, "YT").replace(/蛇口/g, "SK").replace(/宝安/g, "BA").replace(/横岗/g, "HG").replace(/福永/g, "FY").replace(/东莞/g, "DG").replace(/鹤山/g, "HS")}`;
const pointsFor = (name: string) => { const points = name.split("-"); return { origin: points[0], destination: points.at(-1)!, viaPoints: points.slice(1, -1).join("-") || null }; };

async function main() {
  const routeByName = new Map<string, { id: string }>();
  for (const row of routes) {
    const existing = await prisma.route.findUnique({ where: { code: codeFor(row.name) } });
    const route = existing || await prisma.route.create({ data: { code: codeFor(row.name), name: row.name, ...pointsFor(row.name), routeType: RouteType.ROUND_TRIP, standardKilometers: row.kilometers, standardToll: row.toll, standardFuel: row.fuel, applicableContainerTypes: row.containerTypes, note: "历史账单提取的路线基础信息；仅已确认的成本口径已写入。" } });
    routeByName.set(row.name, route);
  }

  const factoryByCode = new Map<string, { id: string; customerId: string }>();
  for (const item of customers) {
    const customer = await prisma.customer.upsert({ where: { code: item.code }, update: { name: item.name, active: true }, create: { code: item.code, name: item.name } });
    const factory = await prisma.factory.upsert({ where: { customerId_name: { customerId: customer.id, name: item.factoryName } }, update: {}, create: { customerId: customer.id, name: item.factoryName, address: "历史账单导入，待补充地址" } });
    factoryByCode.set(item.code, { id: factory.id, customerId: customer.id });
  }

  for (const [customerCode, routeName, containerType, unitPrice] of customerPrices) {
    const customer = factoryByCode.get(customerCode)!;
    const route = routeByName.get(routeName)!;
    const exists = await prisma.routePrice.findFirst({ where: { billType: SettlementBillType.CUSTOMER, routeId: route.id, customerId: customer.customerId, scope: RoutePriceScope.OBJECT, applicableContainerTypes: { has: containerType }, status: RoutePriceStatus.CONFIRMED } });
    if (exists) await prisma.routePrice.update({ where: { id: exists.id }, data: { factoryId: customer.id } });
    else await prisma.routePrice.create({ data: { billType: SettlementBillType.CUSTOMER, routeId: route.id, scope: RoutePriceScope.OBJECT, customerId: customer.customerId, factoryId: customer.id, billingBases: [BillingBasis.CONTAINER], combinations: [BillingCombination.SINGLE], applicableContainerTypes: [containerType], unitPrice, effectiveFrom: new Date("2026-01-01T00:00:00.000Z"), status: RoutePriceStatus.CONFIRMED, confirmedAt: new Date(), note: "历史客户账单提取：样本一致，已按建议确认导入。" } });
  }

  for (const [factoryCode, routeName, containerType, unitPrice] of driverPrices) {
    const factory = factoryByCode.get(factoryCode)!;
    const route = routeByName.get(routeName)!;
    const exists = await prisma.routePrice.findFirst({ where: { billType: SettlementBillType.DRIVER, routeId: route.id, factoryId: factory.id, scope: RoutePriceScope.GENERAL, applicableContainerTypes: { has: containerType }, status: RoutePriceStatus.CONFIRMED } });
    if (!exists) await prisma.routePrice.create({ data: { billType: SettlementBillType.DRIVER, routeId: route.id, scope: RoutePriceScope.GENERAL, factoryId: factory.id, billingBases: [BillingBasis.CONTAINER], combinations: [BillingCombination.SINGLE], applicableContainerTypes: [containerType], unitPrice, effectiveFrom: new Date("2026-01-01T00:00:00.000Z"), status: RoutePriceStatus.CONFIRMED, confirmedAt: new Date(), note: "历史司机账单提取：样本一致，按工厂 + 路线 + 柜型设置，已按建议确认导入。" } });
  }

  console.log(`已导入 ${routes.length} 条路线基础档案、${customerPrices.length} 条客户报价模板、${driverPrices.length} 条司机工资模板。`);
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
