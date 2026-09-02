import { describe, expect, it } from "vitest";
import { createCalendarTask, removeCalendarTask, restoreCalendarTasks, serializeCalendarTasks, updateCalendarTask, type CalendarTask } from "../shared/calendar";

const task: CalendarTask = createCalendarTask({ id: "task-1", title: " Direito Constitucional ", subject: " Direito ", color: "#6869e6" });

describe("calendar task flow", () => {
  it("creates, edits, schedules, unschedules, removes and restores tasks", () => {
    const created = [task];
    const edited = updateCalendarTask(created, "task-1", { title: "Direito Administrativo", subject: "Legislação" });
    const scheduled = updateCalendarTask(edited, "task-1", { date: "2026-09-15" });
    expect(task).toMatchObject({ title: "Direito Constitucional", subject: "Direito" });
    expect(scheduled[0]).toMatchObject({ title: "Direito Administrativo", subject: "Legislação", date: "2026-09-15" });
    const unscheduled = updateCalendarTask(scheduled, "task-1", { date: undefined });
    expect(unscheduled[0]?.date).toBeUndefined();
    const restored = restoreCalendarTasks(serializeCalendarTasks(scheduled));
    expect(restored).toEqual(scheduled);
    expect(removeCalendarTask(restored, "task-1")).toEqual([]);
  });
});
