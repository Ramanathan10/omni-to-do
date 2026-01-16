'use client';

import { useEffect } from 'react';
import { TaskList } from '@/components/tasks/task-list';
import { ProjectList } from '@/components/projects/project-list';
import { useTaskStore } from '@/stores/task-store';
import { useProjectStore } from '@/stores/project-store';

export default function SomedayPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const isLoadingTasks = useTaskStore((state) => state.isLoading);

  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const isLoadingProjects = useProjectStore((state) => state.isLoading);

  useEffect(() => {
    fetchTasks({ status: 'someday' });
    fetchProjects({ status: 'someday' });
  }, [fetchTasks, fetchProjects]);

  const somedayProjects = projects.filter((p) => p.status === 'someday');
  const somedayTasks = tasks.filter((t) => t.status === 'someday');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Someday/Maybe</h1>
        <p className="text-muted-foreground mt-2">
          Future projects and tasks you might want to do someday
        </p>
      </div>

      {/* Someday Projects */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Someday Projects</h2>
        {isLoadingProjects ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading projects...
          </div>
        ) : (
          <ProjectList
            projects={somedayProjects}
            emptyMessage="No someday projects. Mark a project as 'someday' to save it for later."
          />
        )}
      </div>

      {/* Someday Tasks */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Someday Tasks</h2>
        {isLoadingTasks ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading tasks...
          </div>
        ) : (
          <TaskList
            tasks={somedayTasks}
            emptyMessage="No someday tasks. Mark a task as 'someday' to review it later."
            showProject
          />
        )}
      </div>
    </div>
  );
}
