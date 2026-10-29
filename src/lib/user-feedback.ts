/**
 * Reusable, business-facing feedback copy for client-side actions.
 * Keep API or infrastructure details out of the operator experience.
 */
export const userFeedback = {
  network: "网络连接异常，请检查后重试。",
  retry(action: string) {
    return `暂时无法${action}，请检查当前信息后重试。`;
  },
};
