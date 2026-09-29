export function etbCompletionState(resultCount: number, unmatchedCount: number) {
  if (unmatchedCount > 0 || resultCount === 0) {
    return {
      status: "AWAITING_MANUAL" as const,
      sessionState: "MANUAL_HANDOFF_REQUIRED" as const,
      handoffReason: resultCount === 0
        ? "数据源未返回可匹配的在用船期，需人工确认查询条件或建立匹配关系。"
        : `有 ${unmatchedCount} 条 ETB 结果未匹配到船期，需人工确认。`,
    };
  }
  return { status: "SUCCEEDED" as const, sessionState: "ACTIVE" as const, handoffReason: null };
}
