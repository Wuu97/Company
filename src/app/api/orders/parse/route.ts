import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
const execFileAsync=promisify(execFile);
export async function POST(){try{const {stdout,stderr}=await execFileAsync(join(process.cwd(),"node_modules/.bin/tsx"),[join(process.cwd(),"scripts/parse-so-files.ts")],{cwd:process.cwd(),timeout:120000});return NextResponse.json({ok:true,output:stdout,errors:stderr})}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"解析任务失败"},{status:500})}}
