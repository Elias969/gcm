import { describe, expect, it } from "vitest";
import { buildReviewSchedule } from "../shared/study";

describe("buildReviewSchedule", () => {
  it("creates reviews for 1, 7, 14 and 30 days", () => {
    const schedule = buildReviewSchedule(new Date("2026-09-01T00:00:00.000Z"), "medium");
    expect(schedule.map(item => item.days)).toEqual([1, 7, 14, 30]);
    expect(schedule[0]?.scheduledAt.toISOString()).toBe("2026-09-02T00:00:00.000Z");
    expect(schedule[3]?.scheduledAt.toISOString()).toBe("2026-10-01T00:00:00.000Z");
  });
});
