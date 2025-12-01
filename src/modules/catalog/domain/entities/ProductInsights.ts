export interface ProductInsights {
  summary: string;
  pros: string[];
  cons: string[];
  recommendedFor?: string[];
}

/** Type guard for runtime validation of AI responses */
export function isValidProductInsights(obj: unknown): obj is ProductInsights {
  if (!obj || typeof obj !== "object") return false;

  const insights = obj as Record<string, unknown>;

  if (typeof insights.summary !== "string" || insights.summary.length === 0) {
    return false;
  }

  if (!Array.isArray(insights.pros) || insights.pros.length === 0) {
    return false;
  }

  if (!Array.isArray(insights.cons) || insights.cons.length === 0) {
    return false;
  }

  if (
    !insights.pros.every((item) => typeof item === "string" && item.length > 0)
  ) {
    return false;
  }

  if (
    !insights.cons.every((item) => typeof item === "string" && item.length > 0)
  ) {
    return false;
  }

  if (insights.recommendedFor !== undefined) {
    if (!Array.isArray(insights.recommendedFor)) return false;
    if (insights.recommendedFor.length > 3) return false;
    if (
      !insights.recommendedFor.every(
        (item) => typeof item === "string" && item.length > 0,
      )
    ) {
      return false;
    }
  }

  return true;
}
