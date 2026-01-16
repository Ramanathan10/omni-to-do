'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskList } from '@/components/tasks/task-list';
import { useTaskStore } from '@/stores/task-store';
import { useProjectStore } from '@/stores/project-store';
import { useUIStore } from '@/stores/ui-store';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const openTaskForm = useUIStore((state) => state.openTaskForm);
  const openProjectForm = useUIStore((state) => state.openProjectForm);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        const data = await response.json();
        setProject(data.project);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Button onClick={() => router.push('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>
    );
  }

  const activeTasks = project.tasks.filter((t: any) => !t.completedAt);
  const completedTasks = project.tasks.filter((t: any) => t.completedAt);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/projects')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </div>

          {project.description && (
            <p className="text-muted-foreground mt-2">{project.description}</p>
          )}

          <div className="flex items-center gap-4 mt-4 text-sm">
            <div>
              <span className="font-medium">{activeTasks.length}</span>
              <span className="text-muted-foreground ml-1">active</span>
            </div>
            <div>
              <span className="font-medium">{completedTasks.length}</span>
              <span className="text-muted-foreground ml-1">completed</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => openProjectForm(project.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button onClick={() => openTaskForm()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {project.tasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No tasks in this project yet.</p>
          <Button className="mt-4" onClick={() => openTaskForm()}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Task
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {activeTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Active Tasks</h2>
              <TaskList tasks={activeTasks} showProject={false} />
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Completed Tasks</h2>
              <TaskList tasks={completedTasks} showProject={false} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
