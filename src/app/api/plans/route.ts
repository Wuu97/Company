import { NextResponse } from "next/server";
import { z } from "zod";
import { createLoadingPlan } from "@/lib/services/orders";

const schema = z.object({
  soOrderId: z.string().min(1),
  factoryId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  containerUnitIds: z.array(z.string()).min(1),
  reason: z.string().optional(),
});

export async function POST(request: Request) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "计划资料无效" }, { status: 400 });
  if (new Set(input.data.containerUnitIds).size !== input.data.containerUnitIds.length) {
    return NextResponse.json({ error: "柜子不能重复选择" }, { status: 400 });
  }

  try {
    const plan = await createLoadingPlan(input.data);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "计划创建失败" },
      { status: 409 },
    );
  }
}
