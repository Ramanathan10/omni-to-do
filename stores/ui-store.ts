import { create } from 'zustand';

interface UIStore {
  // Task form modal state
  isTaskFormOpen: boolean;
  editingTaskId: string | null;

  // Project form modal state
  isProjectFormOpen: boolean;
  editingProjectId: string | null;

  // View filters
  activeView: 'inbox' | 'available' | 'projects' | 'someday';
  selectedProjectId: string | null;

  // Sidebar state (for mobile)
  isSidebarOpen: boolean;

  // Actions
  openTaskForm: (taskId?: string) => void;
  closeTaskForm: () => void;
  openProjectForm: (projectId?: string) => void;
  closeProjectForm: () => void;
  setActiveView: (view: 'inbox' | 'available' | 'projects' | 'someday') => void;
  setSelectedProject: (projectId: string | null) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  isTaskFormOpen: false,
  editingTaskId: null,
  isProjectFormOpen: false,
  editingProjectId: null,
  activeView: 'inbox',
  selectedProjectId: null,
  isSidebarOpen: false,

  // Task form actions
  openTaskForm: (taskId) =>
    set({ isTaskFormOpen: true, editingTaskId: taskId || null }),

  closeTaskForm: () =>
    set({ isTaskFormOpen: false, editingTaskId: null }),

  // Project form actions
  openProjectForm: (projectId) =>
    set({ isProjectFormOpen: true, editingProjectId: projectId || null }),

  closeProjectForm: () =>
    set({ isProjectFormOpen: false, editingProjectId: null }),

  // View actions
  setActiveView: (view) => set({ activeView: view }),

  setSelectedProject: (projectId) => set({ selectedProjectId: projectId }),

  // Sidebar actions
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  closeSidebar: () => set({ isSidebarOpen: false }),

  openSidebar: () => set({ isSidebarOpen: true }),
}));
