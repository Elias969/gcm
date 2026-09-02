export type ReviewDifficulty = "easy" | "medium" | "hard";

export const REVIEW_INTERVALS = [1, 7, 14, 30] as const;

export function buildReviewSchedule(start: Date, difficulty: ReviewDifficulty) {
  const multiplier = difficulty === "hard" ? 1 : difficulty === "medium" ? 1 : 1;
  return REVIEW_INTERVALS.map(days => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + days * multiplier);
    return { days, difficulty, scheduledAt: date };
  });
}
