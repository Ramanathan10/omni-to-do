'use client';

import { useEffect } from 'react';
import { QuickCapture } from '@/components/tasks/quick-capture';
import { TaskList } from '@/components/tasks/task-list';
import { useTaskStore } from '@/stores/task-store';

export default function InboxPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const isLoading = useTaskStore((state) => state.isLoading);

  useEffect(() => {
    fetchTasks({ status: 'inbox' });
  }, [fetchTasks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inbox</h1>
        <p className="text-muted-foreground mt-2">
          Capture tasks quickly and process them later
        </p>
      </div>

      <QuickCapture />

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading tasks...
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          emptyMessage="Your inbox is empty! Use the quick capture above to add tasks."
          showProject
        />
      )}
    </div>
  );
}
