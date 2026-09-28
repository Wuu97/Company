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
      const current=await tx.containerUnit.findMany({where:{soOrderId:id},select:{containerType:true,planItems:{where:{active:true},select:{id:true}}}});
      const existing=current.length;
      const normalize=(items:{containerType:string;quantity:number}[])=>Object.fromEntries(Object.entries(items.reduce<Record<string,number>>((all,item)=>({...all,[item.containerType]:(all[item.containerType]||0)+item.quantity}),{})).sort());
      const requested=normalize(input.data.containers);
      const existingTypes=normalize(current.map(item=>({containerType:item.containerType,quantity:1})));
      if(existing>0&&JSON.stringify(requested)!==JSON.stringify(existingTypes))throw new Error("柜型或柜量与已创建内部柜子不一致；请使用柜量调整流程。");
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
