'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTaskStore } from '@/stores/task-store';
import { useProjectStore } from '@/stores/project-store';
import { useUIStore } from '@/stores/ui-store';
import { createTaskSchema, type CreateTaskInput } from '@/lib/validations/task';
import { cn } from '@/lib/utils';

export function TaskForm() {
  const isOpen = useUIStore((state) => state.isTaskFormOpen);
  const editingTaskId = useUIStore((state) => state.editingTaskId);
  const closeForm = useUIStore((state) => state.closeTaskForm);

  const tasks = useTaskStore((state) => state.tasks);
  const createTask = useTaskStore((state) => state.createTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [deferDate, setDeferDate] = useState<Date | undefined>(undefined);

  const editingTask = editingTaskId
    ? tasks.find((t) => t.id === editingTaskId)
    : null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      notes: '',
      status: 'inbox',
      projectId: '',
      sortOrder: 0,
    },
  });

  // Load projects on mount
  useEffect(() => {
    fetchProjects({ status: 'active' });
  }, [fetchProjects]);

  // Populate form when editing
  useEffect(() => {
    if (editingTask) {
      setValue('title', editingTask.title);
      setValue('notes', editingTask.notes || '');
      setValue('status', editingTask.status as any);
      setValue('projectId', editingTask.projectId || '');

      if (editingTask.dueDate) {
        const date = new Date(editingTask.dueDate);
        setDueDate(date);
        setValue('dueDate', date.toISOString());
      }
      if (editingTask.deferDate) {
        const date = new Date(editingTask.deferDate);
        setDeferDate(date);
        setValue('deferDate', date.toISOString());
      }
    } else {
      reset();
      setDueDate(undefined);
      setDeferDate(undefined);
    }
  }, [editingTask, setValue, reset]);

  const onSubmit = async (data: CreateTaskInput) => {
    setIsSubmitting(true);

    const taskData = {
      ...data,
      dueDate: dueDate?.toISOString(),
      deferDate: deferDate?.toISOString(),
      projectId: data.projectId || undefined,
    };

    let success = false;
    if (editingTaskId) {
      success = Boolean(await updateTask(editingTaskId, taskData));
    } else {
      success = Boolean(await createTask(taskData));
    }

    setIsSubmitting(false);

    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    reset();
    setDueDate(undefined);
    setDeferDate(undefined);
    closeForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription>
            {editingTask
              ? 'Update the task details below.'
              : 'Add a new task to your list. Set dates to control when it appears.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Task title"
              autoFocus
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Add any additional details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbox">Inbox</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="someday">Someday</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="project">Project</Label>
              <Select
                value={watch('projectId') || 'none'}
                onValueChange={(value) =>
                  setValue('projectId', value === 'none' ? '' : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Defer Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !deferDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deferDate ? format(deferDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deferDate}
                    onSelect={(date) => {
                      setDeferDate(date);
                      setValue('deferDate', date?.toISOString());
                    }}
                    initialFocus
                  />
                  {deferDate && (
                    <div className="p-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setDeferDate(undefined);
                          setValue('deferDate', undefined);
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground mt-1">
                When task becomes available
              </p>
            </div>

            <div>
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dueDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date);
                      setValue('dueDate', date?.toISOString());
                    }}
                    initialFocus
                  />
                  {dueDate && (
                    <div className="p-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setDueDate(undefined);
                          setValue('dueDate', undefined);
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground mt-1">
                When task must be done
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : editingTask
                ? 'Update Task'
                : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
