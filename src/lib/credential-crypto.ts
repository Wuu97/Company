import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

function key() {
  const encoded = process.env.ETB_CREDENTIAL_ENCRYPTION_KEY;
  if (!encoded) throw new Error("未配置 ETB_CREDENTIAL_ENCRYPTION_KEY");
  const value = Buffer.from(encoded, "base64url");
  if (value.length !== 32) throw new Error("ETB_CREDENTIAL_ENCRYPTION_KEY 必须是 32 字节的 base64url 随机值");
  return value;
}
export function encryptCredential(plainText: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  return { ciphertext: ciphertext.toString("base64url"), iv: iv.toString("base64url"), authTag: cipher.getAuthTag().toString("base64url") };
}
export function decryptCredential(input: { ciphertext: string; iv: string; authTag: string }) {
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(input.iv, "base64url"));
  decipher.setAuthTag(Buffer.from(input.authTag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(input.ciphertext, "base64url")), decipher.final()]).toString("utf8");
}
