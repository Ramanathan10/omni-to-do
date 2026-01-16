import type { Task } from '@/types/domain';

/**
 * Gets the display color for a task based on its status and dates.
 * Used for badges and status indicators.
 */
export function getTaskStatusColor(task: Task): string {
  if (task.completedAt) return 'green';
  if (task.status === 'inbox') return 'blue';
  if (task.status === 'someday') return 'gray';

  // Check if overdue
  if (task.dueDate && new Date(task.dueDate) < new Date()) {
    return 'red';
  }

  return 'default';
}

/**
 * Formats a task status for display.
 */
export function formatTaskStatus(status: string): string {
  const statusMap: Record<string, string> = {
    inbox: 'Inbox',
    active: 'Active',
    completed: 'Completed',
    someday: 'Someday',
  };
  return statusMap[status] || status;
}

/**
 * Gets the display label for a task's urgency.
 */
export function getTaskUrgencyLabel(task: Task): string | null {
  if (!task.dueDate) return null;

  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays} days`;

  return null;
}

/**
 * Sorts tasks by priority: overdue first, then by due date, then by creation date.
 */
export function sortTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Completed tasks go to the end
    if (a.completedAt && !b.completedAt) return 1;
    if (!a.completedAt && b.completedAt) return -1;

    // Overdue tasks first
    const aOverdue = a.dueDate && new Date(a.dueDate) < new Date();
    const bOverdue = b.dueDate && new Date(b.dueDate) < new Date();
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // Then by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    // Finally by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Checks if a task has children (subtasks).
 */
export function hasSubtasks(task: Task & { children?: Task[] }): boolean {
  return Boolean(task.children && task.children.length > 0);
}

/**
 * Counts the number of incomplete subtasks for a task.
 */
export function countIncompleteSubtasks(task: Task & { children?: Task[] }): number {
  if (!task.children) return 0;
  return task.children.filter((child) => !child.completedAt).length;
}
