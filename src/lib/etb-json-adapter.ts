import { readFile } from "node:fs/promises";
import type { EtbQueryAdapter, EtbQueryResult } from "./etb-query";
type JsonRow={terminal:string;carrier:string;vesselName:string;voyage:string;etbAt:string;sourceUrl?:string};
export class JsonEtbAdapter implements EtbQueryAdapter{source="JSON_FILE";constructor(private readonly path:string){}async query({terminal}:{terminal:string}):Promise<EtbQueryResult[]>{const rows=JSON.parse(await readFile(this.path,"utf8")) as JsonRow[];return rows.filter(row=>row.terminal===terminal).map(row=>{const etbAt=new Date(row.etbAt);if(Number.isNaN(etbAt.valueOf()))throw new Error(`无效 ETB 时间：${row.etbAt}`);return {...row,etbAt};});}}
