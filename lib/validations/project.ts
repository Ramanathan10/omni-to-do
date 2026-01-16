import { z } from 'zod';

export const projectStatusSchema = z.enum(['active', 'someday', 'completed', 'dropped']);

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  status: projectStatusSchema.optional().default('active'),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
