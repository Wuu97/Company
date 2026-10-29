import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const factoryNames = ["万事泰", "建威制衣有限公司", "德纳斯", "新兴县恒骏达不锈钢有限公司", "新兴欧亚", "昊鼎", "欧亚厂", "鹤山共和镇"];

async function main() {
  let created = 0;
  for (const name of factoryNames) {
    const existing = await prisma.factory.findFirst({ where: { name } });
    if (existing) continue;
    const code = `HIST-FACTORY-${created + 1}-${Date.now().toString().slice(-6)}`;
    const customer = await prisma.customer.create({ data: { code, name } });
    await prisma.factory.create({ data: { customerId: customer.id, name, address: "历史司机账单导入，待补充详细地址" } });
    created += 1;
  }
  console.log(`司机历史账单工厂导入完成：新增 ${created} 个，全部 ${factoryNames.length} 个原始名称均已在工厂列表中。`);
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
