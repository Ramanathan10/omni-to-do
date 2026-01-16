'use client';

import { useState } from 'react';
import { Calendar, ChevronRight, MoreVertical, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTaskStore } from '@/stores/task-store';
import { useUIStore } from '@/stores/ui-store';
import { isTaskOverdue, isTaskDeferred } from '@/lib/utils/date-filters';
import type { TaskWithProject } from '@/types/domain';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: TaskWithProject;
  showProject?: boolean;
  onTaskClick?: (taskId: string) => void;
}

export function TaskItem({ task, showProject = true, onTaskClick }: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const completeTask = useTaskStore((state) => state.completeTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const openTaskForm = useUIStore((state) => state.openTaskForm);

  const handleComplete = async (checked: boolean) => {
    if (checked && !isCompleting) {
      setIsCompleting(true);
      await completeTask(task.id);
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
  };

  const isOverdue = isTaskOverdue(task);
  const isDeferred = isTaskDeferred(task);

  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors',
        task.completedAt && 'opacity-60'
      )}
    >
      <Checkbox
        checked={Boolean(task.completedAt)}
        onCheckedChange={handleComplete}
        disabled={isCompleting}
        className="mt-1"
      />

      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openTaskForm(task.id)}>
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={cn(
              'font-medium',
              task.completedAt && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </h3>

          {task.status === 'inbox' && (
            <Badge variant="secondary" className="text-xs">
              Inbox
            </Badge>
          )}

          {showProject && task.project && (
            <Badge variant="outline" className="text-xs">
              {task.project.title}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
          {task.deferDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className={cn(isDeferred && 'text-orange-600 font-medium')}>
                {isDeferred ? 'Deferred until ' : 'Available '}{' '}
                {format(new Date(task.deferDate), 'MMM d')}
              </span>
            </div>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className={cn(isOverdue && 'text-red-600 font-medium')}>
                Due {format(new Date(task.dueDate), 'MMM d')}
              </span>
            </div>
          )}

          {task.children && task.children.length > 0 && (
            <span className="text-xs">
              {task.children.filter((c) => !c.completedAt).length} subtasks
            </span>
          )}
        </div>

        {task.notes && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {task.notes}
          </p>
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
          <DropdownMenuItem onClick={() => openTaskForm(task.id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
