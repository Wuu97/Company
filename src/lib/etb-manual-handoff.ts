export function manualHandoffUpdate(note: string, resume: boolean) {
  const manualHandledAt = new Date();
  return resume
    ? { status: "PENDING" as const, sessionState: "NOT_REQUIRED" as const, startedAt: null, finishedAt: null, errorMessage: null, handoffReason: null, retryAfter: null, manualHandledAt }
    : { handoffReason: note, manualHandledAt };
}
