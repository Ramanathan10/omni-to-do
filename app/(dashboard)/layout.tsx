'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/sidebar';
import { TaskForm } from '@/components/tasks/task-form';
import { ProjectForm } from '@/components/projects/project-form';
import { useUIStore } from '@/stores/ui-store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b bg-background px-4 py-3 lg:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Omni To-Do</h1>
        </header>

        {/* Page content */}
        <main className="container max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Global modals */}
      <TaskForm />
      <ProjectForm />
    </div>
  );
}
