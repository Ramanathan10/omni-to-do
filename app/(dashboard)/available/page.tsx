'use client';

import { useEffect, useMemo } from 'react';
import { TaskList } from '@/components/tasks/task-list';
import { useTaskStore } from '@/stores/task-store';
import { groupTasksByDueDate } from '@/lib/utils/date-filters';

export default function AvailablePage() {
  const tasks = useTaskStore((state) => state.tasks);
  const fetchAvailableTasks = useTaskStore((state) => state.fetchAvailableTasks);
  const isLoading = useTaskStore((state) => state.isLoading);

  useEffect(() => {
    fetchAvailableTasks();
  }, [fetchAvailableTasks]);

  const groupedTasks = useMemo(() => {
    const grouped = groupTasksByDueDate(tasks);

    return [
      {
        title: 'Overdue',
        tasks: grouped.overdue,
        variant: 'destructive' as const,
      },
      {
        title: 'Today',
        tasks: grouped.today,
        variant: 'warning' as const,
      },
      {
        title: 'Tomorrow',
        tasks: grouped.tomorrow,
        variant: 'default' as const,
      },
      {
        title: 'This Week',
        tasks: grouped.thisWeek,
        variant: 'default' as const,
      },
      {
        title: 'Later',
        tasks: grouped.later,
        variant: 'default' as const,
      },
      {
        title: 'No Due Date',
        tasks: grouped.noDueDate,
        variant: 'default' as const,
      },
    ];
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Tasks</h1>
        <p className="text-muted-foreground mt-2">
          Tasks that are ready to work on now (defer date has passed, status is active)
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading available tasks...
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          grouped
          groups={groupedTasks}
          emptyMessage="No tasks available to work on right now. Check your inbox or create new tasks!"
          showProject
        />
      )}
    </div>
  );
}
