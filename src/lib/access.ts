export type TmsRole="VIEWER"|"OPERATOR"|"ADMIN";
export function roleFromHeaders(headers:Headers):TmsRole{const value=headers.get("x-tms-role")?.toUpperCase();if(value==="ADMIN"||value==="OPERATOR"||value==="VIEWER")return value;const fallback=process.env.TMS_DEFAULT_ROLE?.toUpperCase();if(fallback==="ADMIN"||fallback==="OPERATOR"||fallback==="VIEWER")return fallback;return process.env.NODE_ENV==="production"?"VIEWER":"OPERATOR";}
export function canWrite(role:TmsRole){return role==="ADMIN"||role==="OPERATOR";}
