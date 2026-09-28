import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema=z.object({customerId:z.string().min(1).optional(),soNumber:z.string().min(1),carrier:z.string().min(1),siCutoffText:z.string().optional(),containers:z.array(z.object({containerType:z.string().min(1),quantity:z.number().int().min(1).default(1),containerNo:z.string().optional()}))});

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  const input=schema.safeParse(await request.json());
  if(!input.success)return NextResponse.json({error:"核对资料无效"},{status:400});
  const {id}=await params;
  try{
    const order=await prisma.$transaction(async tx=>{
      const before=await tx.soOrder.findUniqueOrThrow({where:{id}});
      if(input.data.customerId&&!await tx.customer.findUnique({where:{id:input.data.customerId},select:{id:true}}))throw new Error("客户不存在");
      const existing=await tx.containerUnit.count({where:{soOrderId:id}});
      const requested=input.data.containers.reduce((total,item)=>total+item.quantity,0);
      if(existing>0&&requested!==existing)throw new Error(`已创建 ${existing} 个内部柜子，不能直接改为 ${requested} 个；请使用柜量调整流程。`);
      const updated=await tx.soOrder.update({where:{id},data:{customerId:input.data.customerId||before.customerId,soNumber:input.data.soNumber,carrier:input.data.carrier,siCutoffText:input.data.siCutoffText||null,parseStatus:"VERIFIED"}});
      if(existing===0){
        const rows=input.data.containers.flatMap(item=>Array.from({length:item.quantity},()=>({soOrderId:id,containerType:item.containerType,containerNo:item.containerNo||null})));
        await tx.containerUnit.createMany({data:rows.map((row,index)=>({...row,internalCode:`IC-${id.slice(-6).toUpperCase()}-${String(index+1).padStart(3,"0")}`}))});
      }
      await tx.operationLog.create({data:{action:"SO_REVIEWED",entityType:"SoOrder",entityId:id,before:{soNumber:before.soNumber,carrier:before.carrier,siCutoffText:before.siCutoffText},after:input.data}});
      return updated;
    });
    return NextResponse.json(order);
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"SO 核对失败"},{status:409});}
}
