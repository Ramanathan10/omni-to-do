import { create } from 'zustand';
import type { Project, ProjectWithTasks, CreateProjectInput, UpdateProjectInput } from '@/types/domain';

interface ProjectStore {
  // State
  projects: ProjectWithTasks[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: (filters?: { status?: string }) => Promise<void>;
  createProject: (input: CreateProjectInput) => Promise<Project | null>;
  updateProject: (id: string, updates: UpdateProjectInput) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;

  // Local state updates
  setProjects: (projects: ProjectWithTasks[]) => void;
  addProject: (project: ProjectWithTasks) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  // Initial state
  projects: [],
  isLoading: false,
  error: null,

  // Fetch projects with optional filters
  fetchProjects: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);

      const response = await fetch(`/api/projects?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      set({ projects: data.projects, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message, isLoading: false });
    }
  },

  // Create a new project
  createProject: async (input) => {
    set({ error: null });
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const data = await response.json();
      set((state) => ({ projects: [data.project, ...state.projects] }));
      return data.project;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message });
      return null;
    }
  },

  // Update a project
  updateProject: async (id, updates) => {
    set({ error: null });
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }

      const data = await response.json();
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? data.project : p)),
      }));
      return data.project;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message });
      return null;
    }
  },

  // Delete a project
  deleteProject: async (id) => {
    set({ error: null });
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message });
      return false;
    }
  },

  // Local state updates
  setProjects: (projects) => set({ projects }),

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  removeProject: (id) =>
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
}));
