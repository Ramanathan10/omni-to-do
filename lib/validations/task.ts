import { z } from 'zod';

export const taskStatusSchema = z.enum(['inbox', 'active', 'completed', 'someday']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title is too long'),
  notes: z.string().max(5000, 'Notes are too long').optional(),
  status: taskStatusSchema,
  dueDate: z.string().optional(),
  deferDate: z.string().optional(),
  projectId: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().int(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completedAt: z.string().optional(),
});

export const completeTaskSchema = z.object({
  completedAt: z.date(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;
