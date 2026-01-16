'use client';

import { FolderOpen, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjectStore } from '@/stores/project-store';
import { useUIStore } from '@/stores/ui-store';
import type { ProjectWithTasks, Task } from '@/types/domain';

interface ProjectListProps {
  projects: ProjectWithTasks[];
  emptyMessage?: string;
}

export function ProjectList({ projects, emptyMessage = 'No projects found' }: ProjectListProps) {
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const openProjectForm = useUIStore((state) => state.openProjectForm);

  const handleDelete = async (id: string, title: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${title}"? This will also delete all associated tasks.`
      )
    ) {
      await deleteProject(id);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const totalTasks = project.tasks.length;
        const completedTasks = project.tasks.filter((t: Task) => t.completedAt).length;
        const activeTasks = totalTasks - completedTasks;
        const overdueTasks = project.tasks.filter(
          (t: Task) => !t.completedAt && t.dueDate && new Date(t.dueDate) < new Date()
        ).length;

        return (
          <Card key={project.id} className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link href={`/projects/${project.id}`}>
                    <CardTitle className="hover:underline cursor-pointer">
                      {project.title}
                    </CardTitle>
                  </Link>
                  {project.description && (
                    <CardDescription className="mt-1.5 line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openProjectForm(project.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(project.id, project.title)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="font-medium">{activeTasks}</span>
                  <span className="text-muted-foreground ml-1">active</span>
                </div>
                <div>
                  <span className="font-medium">{completedTasks}</span>
                  <span className="text-muted-foreground ml-1">completed</span>
                </div>
                {overdueTasks > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {overdueTasks} overdue
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
