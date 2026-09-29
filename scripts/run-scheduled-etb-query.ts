import { runEtbQuery } from "@/lib/etb-query";
import { chinaDateParts } from "@/lib/time";
async function main(){const now=new Date();const {hour,minute}=chinaDateParts(now);if(![10,16].includes(hour)||minute>10)throw new Error("此任务仅应在中国时间 10:00 或 16:00 触发。");const runs=await Promise.all(["盐田","蛇口"].map(terminal=>runEtbQuery({terminal,source:"UNCONFIGURED",scheduledFor:now})));console.log(JSON.stringify(runs.map(run=>({terminal:run.terminal,status:run.status,id:run.id}))));process.exitCode=runs.some(run=>run.status==="FAILED")?1:0;}
main().catch(error=>{console.error(error);process.exitCode=1;});
