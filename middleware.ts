import { NextResponse, type NextRequest } from "next/server";
import { canWrite, roleFromHeaders } from "@/lib/access";
export function middleware(request:NextRequest){if(request.method==="GET"||request.method==="HEAD"||request.method==="OPTIONS")return NextResponse.next();if(!canWrite(roleFromHeaders(request.headers)))return NextResponse.json({error:"当前角色仅可查看，不能执行修改操作。"},{status:403});return NextResponse.next();}
export const config={matcher:"/api/:path*"};
