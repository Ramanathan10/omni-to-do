'use client';

import { TaskItem } from './task-item';
import type { Task, TaskWithProject } from '@/types/domain';

interface TaskListProps {
  tasks: TaskWithProject[];
  showProject?: boolean;
  emptyMessage?: string;
  grouped?: boolean;
  groups?: {
    title: string;
    tasks: TaskWithProject[];
    variant?: 'default' | 'destructive' | 'warning';
  }[];
}

export function TaskList({
  tasks,
  showProject = true,
  emptyMessage = 'No tasks found',
  grouped = false,
  groups,
}: TaskListProps) {
  if (grouped && groups) {
    const hasAnyTasks = groups.some((group) => group.tasks.length > 0);

    if (!hasAnyTasks) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {groups.map((group) => {
          if (group.tasks.length === 0) return null;

          return (
            <div key={group.title}>
              <div className="flex items-center gap-2 mb-3">
                <h2
                  className={`text-sm font-semibold uppercase tracking-wide ${
                    group.variant === 'destructive'
                      ? 'text-red-600'
                      : group.variant === 'warning'
                      ? 'text-orange-600'
                      : 'text-muted-foreground'
                  }`}
                >
                  {group.title}
                </h2>
                <span className="text-sm text-muted-foreground">
                  ({group.tasks.length})
                </span>
              </div>
              <div className="space-y-2">
                {group.tasks.map((task) => (
                  <TaskItem key={task.id} task={task} showProject={showProject} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} showProject={showProject} />
      ))}
    </div>
  );
}
