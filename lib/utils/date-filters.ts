import { startOfDay, addDays, isSameDay, isBefore, isAfter } from 'date-fns';
import type { Task, GroupedTasks } from '@/types/domain';

/**
 * Determines if a task is "available" to work on based on OmniFocus logic.
 * A task is available when:
 * 1. Status is 'active'
 * 2. Not completed (completedAt is null)
 * 3. Defer date has passed or doesn't exist
 */
export function isTaskAvailable(task: Task): boolean {
  // Must be active status
  if (task.status !== 'active') return false;

  // Must not be completed
  if (task.completedAt) return false;

  // If has defer date, must be today or past
  if (task.deferDate) {
    const today = startOfDay(new Date());
    const defer = startOfDay(new Date(task.deferDate));
    if (isAfter(defer, today)) return false;
  }

  return true;
}

/**
 * Groups tasks by their due date proximity for the Available view.
 * This creates urgency-based sections: overdue, today, tomorrow, this week, later, no due date.
 */
export function groupTasksByDueDate(tasks: Task[]): GroupedTasks {
  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = addDays(today, 1);
  const weekEnd = addDays(today, 7);

  return {
    overdue: tasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = startOfDay(new Date(t.dueDate));
      return isBefore(dueDate, today);
    }),
    today: tasks.filter((t) => {
      if (!t.dueDate) return false;
      return isSameDay(new Date(t.dueDate), today);
    }),
    tomorrow: tasks.filter((t) => {
      if (!t.dueDate) return false;
      return isSameDay(new Date(t.dueDate), tomorrow);
    }),
    thisWeek: tasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return isAfter(dueDate, tomorrow) && isBefore(dueDate, weekEnd) || isSameDay(dueDate, weekEnd);
    }),
    later: tasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return isAfter(dueDate, weekEnd);
    }),
    noDueDate: tasks.filter((t) => !t.dueDate),
  };
}

/**
 * Filters an array of tasks to only include available ones.
 */
export function filterAvailableTasks(tasks: Task[]): Task[] {
  return tasks.filter(isTaskAvailable);
}

/**
 * Checks if a task is overdue.
 */
export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.completedAt) return false;
  const today = startOfDay(new Date());
  const dueDate = startOfDay(new Date(task.dueDate));
  return isBefore(dueDate, today);
}

/**
 * Checks if a task is deferred (not yet available).
 */
export function isTaskDeferred(task: Task): boolean {
  if (!task.deferDate || task.completedAt) return false;
  const today = startOfDay(new Date());
  const defer = startOfDay(new Date(task.deferDate));
  return isAfter(defer, today);
}
