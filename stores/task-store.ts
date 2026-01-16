import { create } from 'zustand';
import type { Task, TaskWithProject, CreateTaskInput, UpdateTaskInput } from '@/types/domain';

interface TaskStore {
  // State
  tasks: TaskWithProject[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: (filters?: { status?: string; projectId?: string }) => Promise<void>;
  fetchAvailableTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task | null>;
  updateTask: (id: string, updates: UpdateTaskInput) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  completeTask: (id: string) => Promise<boolean>;

  // Optimistic updates
  setTasks: (tasks: TaskWithProject[]) => void;
  addTask: (task: TaskWithProject) => void;
  removeTask: (id: string) => void;
  updateTaskLocal: (id: string, updates: Partial<Task>) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: [],
  isLoading: false,
  error: null,

  // Fetch tasks with optional filters
  fetchTasks: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.projectId) params.append('projectId', filters.projectId);

      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');

      const data = await response.json();
      set({ tasks: data.tasks, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message, isLoading: false });
    }
  },

  // Fetch only available tasks
  fetchAvailableTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tasks?view=available&status=active');
      if (!response.ok) throw new Error('Failed to fetch available tasks');

      const data = await response.json();
      set({ tasks: data.tasks, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message, isLoading: false });
    }
  },

  // Create a new task
  createTask: async (input) => {
    set({ error: null });
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      const data = await response.json();
      set((state) => ({ tasks: [data.task, ...state.tasks] }));
      return data.task;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message });
      return null;
    }
  },

  // Update a task
  updateTask: async (id, updates) => {
    set({ error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      const data = await response.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? data.task : t)),
      }));
      return data.task;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message });
      return null;
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    set({ error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message });
      return false;
    }
  },

  // Complete a task (sets completedAt to now, status to completed)
  completeTask: async (id) => {
    set({ error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          completedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to complete task');

      const data = await response.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? data.task : t)),
      }));
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message });
      return false;
    }
  },

  // Local state updates (optimistic)
  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),

  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  updateTaskLocal: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),
}));
