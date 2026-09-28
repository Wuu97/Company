import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
export interface FileStorage { put(input:{bytes:Buffer; originalName:string}):Promise<{key:string;sha256:string}> }
export class LocalFileStorage implements FileStorage { async put({bytes,originalName}:{bytes:Buffer;originalName:string}) { const sha256=createHash("sha256").update(bytes).digest("hex"); const root=process.env.FILE_STORAGE_ROOT||"./uploads"; await mkdir(root,{recursive:true}); const key=`${sha256}-${originalName.replace(/[^a-zA-Z0-9._-]/g,"_")}`; await writeFile(join(root,key),bytes,{flag:"wx"}).catch(e=>{if(e.code!=="EEXIST")throw e}); return {key,sha256}; } }
