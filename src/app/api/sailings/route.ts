import { NextResponse } from "next/server";
export async function POST(){return NextResponse.json({error:"船期仅由已核对的 SO 自动归集，不能手工创建"},{status:405});}
