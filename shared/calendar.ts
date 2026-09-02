export type CalendarTask = { id: string; title: string; subject: string; date?: string; color: string };

export function createCalendarTask(input: { id: string; title: string; subject?: string; color: string }): CalendarTask {
  return { id: input.id, title: input.title.trim(), subject: input.subject?.trim() || "Estudo geral", color: input.color };
}

export function serializeCalendarTasks(tasks: CalendarTask[]) {
  return JSON.stringify(tasks);
}

export function updateCalendarTask(tasks: CalendarTask[], id: string, changes: Partial<Pick<CalendarTask, "title" | "subject" | "date">>) {
  return tasks.map(task => task.id === id ? { ...task, ...changes } : task);
}

export function removeCalendarTask(tasks: CalendarTask[], id: string) {
  return tasks.filter(task => task.id !== id);
}

export function restoreCalendarTasks(serialized: string | null): CalendarTask[] {
  if (!serialized) return [];
  try {
    const value = JSON.parse(serialized);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
