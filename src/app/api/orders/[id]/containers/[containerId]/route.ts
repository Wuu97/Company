import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/lib/auth";

const schema = z.object({ containerNo: z.string().trim().max(30).nullable() });

export async function PATCH(request: Request) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "实际柜号资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  return NextResponse.json({ error: "实际柜号仅可在装柜计划的“确认装柜完成”操作中登记。" }, { status: 409 });
}
