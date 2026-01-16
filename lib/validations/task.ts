import { z } from 'zod';

export const taskStatusSchema = z.enum(['inbox', 'active', 'completed', 'someday']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title is too long'),
  notes: z.string().max(5000, 'Notes are too long').optional(),
  status: taskStatusSchema.optional().default('inbox'),
  dueDate: z.coerce.date().optional().nullable(),
  deferDate: z.coerce.date().optional().nullable(),
  projectId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completedAt: z.coerce.date().optional().nullable(),
});

export const completeTaskSchema = z.object({
  completedAt: z.coerce.date().default(() => new Date()),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;
