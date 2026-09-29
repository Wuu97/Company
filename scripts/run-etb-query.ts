import { runEtbQuery } from "@/lib/etb-query";
import { JsonEtbAdapter } from "@/lib/etb-json-adapter";
const args=process.argv.slice(2);const get=(name:string)=>args[args.indexOf(name)+1];const terminal=get("--terminal");
if(!terminal)throw new Error("用法：tsx scripts/run-etb-query.ts --terminal 盐田|蛇口 [--source 名称]");
async function main(){const adapter=process.env.ETB_QUERY_JSON_PATH?new JsonEtbAdapter(process.env.ETB_QUERY_JSON_PATH):undefined;const run=await runEtbQuery({terminal,source:get("--source")||adapter?.source||"UNCONFIGURED",scheduledFor:new Date(),adapter});console.log(JSON.stringify({id:run.id,terminal:run.terminal,status:run.status,errorMessage:run.errorMessage}));process.exitCode=run.status==="FAILED"?1:0;}
main().catch(error=>{console.error(error);process.exitCode=1;});
