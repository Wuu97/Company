export class EtbManualHandoffRequiredError extends Error {
  constructor(
    message: string,
    readonly sessionState: "EXPIRED" | "ROBOT_VERIFICATION_REQUIRED" | "MANUAL_HANDOFF_REQUIRED",
    readonly options?: { screenshotStorageKey?: string; retryAfter?: Date },
  ) {
    super(message);
    this.name = "EtbManualHandoffRequiredError";
  }
}

export function etbQueryFailureState(error: unknown) {
  if (error instanceof EtbManualHandoffRequiredError) {
    return {
      status: "AWAITING_MANUAL" as const,
      sessionState: error.sessionState,
      errorMessage: error.message,
      handoffReason: error.message,
      screenshotStorageKey: error.options?.screenshotStorageKey,
      retryAfter: error.options?.retryAfter,
    };
  }
  return {
    status: "FAILED" as const,
    sessionState: "NOT_REQUIRED" as const,
    errorMessage: error instanceof Error ? error.message : "未知查询失败",
  };
}
