export type EtbSourceConfig = {
  terminal: "盐田" | "蛇口";
  source: string;
  homeUrl: string;
  queryUrl?: string;
  authentication: "LOGIN_REQUIRED" | "TECHNICAL_VERIFICATION_REQUIRED";
  automationStatus: "PENDING_TECHNICAL_VERIFICATION";
  credentialEnvPrefix: "ETB_YANTIAN" | "ETB_SHEKOU";
  loginSelectorStatus: "PENDING_TECHNICAL_VERIFICATION";
};

const sources: Record<EtbSourceConfig["terminal"], EtbSourceConfig> = {
  盐田: {
    terminal: "盐田",
    source: "YANTIAN_CONTROLLED_BROWSER",
    homeUrl: "https://www.156yt.cn/",
    queryUrl: "https://www.156yt.cn/pqs_revision/pages/jsp/voyQuery.jsp",
    authentication: "LOGIN_REQUIRED",
    automationStatus: "PENDING_TECHNICAL_VERIFICATION",
    credentialEnvPrefix: "ETB_YANTIAN",
    loginSelectorStatus: "PENDING_TECHNICAL_VERIFICATION",
  },
  蛇口: {
    terminal: "蛇口",
    source: "SHEKOU_CONTROLLED_BROWSER",
    homeUrl: "https://wk-eport.cmp1872.com/",
    authentication: "LOGIN_REQUIRED",
    automationStatus: "PENDING_TECHNICAL_VERIFICATION",
    credentialEnvPrefix: "ETB_SHEKOU",
    loginSelectorStatus: "PENDING_TECHNICAL_VERIFICATION",
  },
};

export function getEtbSourceConfig(terminal: string): EtbSourceConfig {
  const config = sources[terminal as EtbSourceConfig["terminal"]];
  if (!config) throw new Error("仅支持盐田或蛇口 ETB 受控浏览器 Worker");
  return config;
}
