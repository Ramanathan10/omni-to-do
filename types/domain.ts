import { Task as PrismaTask, Project as PrismaProject } from '@prisma/client';

// Re-export Prisma types
export type Task = PrismaTask;
export type Project = PrismaProject;

// Task with optional relations
export type TaskWithProject = Task & {
  project?: Project | null;
  children?: Task[];
};

// Project with tasks
export type ProjectWithTasks = Project & {
  tasks: Task[];
};

// Task status types
export type TaskStatus = 'inbox' | 'active' | 'completed' | 'someday';
export type ProjectStatus = 'active' | 'someday' | 'completed' | 'dropped';

// Form input types
export type CreateTaskInput = {
  title: string;
  notes?: string;
  status?: TaskStatus;
  dueDate?: Date | string;
  deferDate?: Date | string;
  projectId?: string;
  parentId?: string;
  sortOrder?: number;
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  completedAt?: Date | string | null;
};

export type CreateProjectInput = {
  title: string;
  description?: string;
  status?: ProjectStatus;
};

export type UpdateProjectInput = Partial<CreateProjectInput>;

// View filter types
export type TaskViewType = 'inbox' | 'available' | 'all' | 'completed' | 'someday';
export type ProjectViewType = 'active' | 'someday' | 'all';

// Grouped tasks for the Available view
export type GroupedTasks = {
  overdue: Task[];
  today: Task[];
  tomorrow: Task[];
  thisWeek: Task[];
  later: Task[];
  noDueDate: Task[];
};
