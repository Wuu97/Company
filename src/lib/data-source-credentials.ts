import { decryptCredential } from "@/lib/credential-crypto";
import { prisma } from "@/lib/prisma";

export async function getDataSourceCredential(terminal: string) {
  const credential = await prisma.dataSourceCredential.findUnique({ where: { terminal }, select: { username: true, ciphertext: true, iv: true, authTag: true } });
  if (!credential) throw new Error(`${terminal} 平台账号尚未在系统设置中配置`);
  return { username: credential.username, password: decryptCredential(credential) };
}
