import { NextResponse } from "next/server";
import { z } from "zod";
import { adjustContainers } from "@/lib/services/orders";
import { currentUser } from "@/lib/auth";

const schema = z.object({
  reason: z.string().min(1),
  containers: z.array(z.object({ containerType: z.string().min(1), quantity: z.number().int().min(0) })).min(1),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success || !input.data.containers.some(item => item.quantity > 0)) {
    return NextResponse.json({ error: "柜量调整资料无效" }, { status: 400 });
  }
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  try {
    return NextResponse.json(await adjustContainers({ ...input.data, orderId: (await params).id, actor }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "柜量调整失败" }, { status: 409 });
  }
}
