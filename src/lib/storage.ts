import { createHash } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
export interface FileStorage { put(input:{bytes:Buffer; originalName:string}):Promise<{key:string;sha256:string;created:boolean}> }
export class LocalFileStorage implements FileStorage {
  private root() { return process.env.FILE_STORAGE_ROOT || "./uploads"; }

  async put({bytes,originalName}:{bytes:Buffer;originalName:string}) {
    const sha256=createHash("sha256").update(bytes).digest("hex");
    const root=this.root();
    await mkdir(root,{recursive:true});
    const key=`${sha256}-${originalName.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
    let created=true;
    await writeFile(join(root,key),bytes,{flag:"wx"}).catch(error=>{
      if((error as NodeJS.ErrnoException).code==="EEXIST") { created=false; return; }
      throw error;
    });
    return {key,sha256,created};
  }

  async remove(key:string) {
    await unlink(join(this.root(),key)).catch(error=>{
      if((error as NodeJS.ErrnoException).code!=="ENOENT") throw error;
    });
  }
}
