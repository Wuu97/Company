export type EtbSourceConfig = {
  terminal: "盐田" | "蛇口";
  source: string;
  homeUrl: string;
  allowedEvidenceHosts?: string[];
  queryLandingUrl?: string;
  queryUrl?: string;
  authentication: "LOGIN_REQUIRED" | "TECHNICAL_VERIFICATION_REQUIRED";
  automationStatus: "PENDING_TECHNICAL_VERIFICATION";
  credentialEnvPrefix: "ETB_YANTIAN" | "ETB_SHEKOU";
  loginSelectorStatus: "PENDING_TECHNICAL_VERIFICATION";
  throttle: { batchMaxSailings: number; queryIntervalMs: number; maxAttempts: number; retryBaseDelayMs: number };
};

const sources: Record<EtbSourceConfig["terminal"], EtbSourceConfig> = {
  盐田: {
    terminal: "盐田",
    source: "YANTIAN_CONTROLLED_BROWSER",
    homeUrl: "https://www.156yt.cn/",
    queryLandingUrl: "https://www.156yt.cn/publicInfoService/index.action",
    queryUrl: "https://www.156yt.cn/pqs_revision/pages/jsp/voyQuery.jsp",
    authentication: "LOGIN_REQUIRED",
    automationStatus: "PENDING_TECHNICAL_VERIFICATION",
    credentialEnvPrefix: "ETB_YANTIAN",
    loginSelectorStatus: "PENDING_TECHNICAL_VERIFICATION",
    throttle: { batchMaxSailings: 20, queryIntervalMs: 1_200, maxAttempts: 2, retryBaseDelayMs: 3_000 },
  },
  蛇口: {
    terminal: "蛇口",
    source: "SHEKOU_CONTROLLED_BROWSER",
    // ePort owns authentication. wk-eport becomes available only after its SSO
    // session is established; direct anonymous navigation can return 404.
    homeUrl: "https://eport.cmp1872.com/login#",
    allowedEvidenceHosts: ["eport.cmp1872.com", "wk-eport.cmp1872.com"],
    queryLandingUrl: "https://wk-eport.cmp1872.com/#/main/home",
    authentication: "LOGIN_REQUIRED",
    automationStatus: "PENDING_TECHNICAL_VERIFICATION",
    credentialEnvPrefix: "ETB_SHEKOU",
    loginSelectorStatus: "PENDING_TECHNICAL_VERIFICATION",
    throttle: { batchMaxSailings: 10, queryIntervalMs: 2_000, maxAttempts: 2, retryBaseDelayMs: 4_000 },
  },
};

export function getEtbSourceConfig(terminal: string): EtbSourceConfig {
  const config = sources[terminal as EtbSourceConfig["terminal"]];
  if (!config) throw new Error("仅支持盐田或蛇口 ETB 受控浏览器 Worker");
  return config;
}
