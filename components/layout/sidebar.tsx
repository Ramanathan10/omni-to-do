'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Inbox,
  CheckCircle2,
  FolderOpen,
  Clock,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTaskStore } from '@/stores/task-store';
import { useProjectStore } from '@/stores/project-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);
  const openTaskForm = useUIStore((state) => state.openTaskForm);
  const openProjectForm = useUIStore((state) => state.openProjectForm);

  // Fetch tasks and projects on mount
  useEffect(() => {
    fetchTasks();
    fetchProjects({ status: 'active' });
  }, [fetchTasks, fetchProjects]);

  // Calculate counts
  const inboxCount = tasks.filter((t) => t.status === 'inbox').length;
  const availableCount = tasks.filter(
    (t) =>
      t.status === 'active' &&
      !t.completedAt &&
      (!t.deferDate || new Date(t.deferDate) <= new Date())
  ).length;

  const navItems = [
    {
      href: '/inbox',
      label: 'Inbox',
      icon: Inbox,
      count: inboxCount,
    },
    {
      href: '/available',
      label: 'Available',
      icon: CheckCircle2,
      count: availableCount,
    },
    {
      href: '/projects',
      label: 'Projects',
      icon: FolderOpen,
      count: projects.length,
    },
    {
      href: '/someday',
      label: 'Someday/Maybe',
      icon: Clock,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col transition-transform lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold">Omni To-Do</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={closeSidebar}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick actions */}
        <div className="p-4 space-y-2">
          <Button
            className="w-full justify-start"
            onClick={() => {
              openTaskForm();
              closeSidebar();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              openProjectForm();
              closeSidebar();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} onClick={closeSidebar}>
                <div
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <Badge
                      variant={isActive ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {item.count}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Active projects */}
          {projects.length > 0 && (
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Active Projects
              </h3>
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  onClick={closeSidebar}
                >
                  <div
                    className={cn(
                      'px-3 py-2 rounded-lg transition-colors hover:bg-accent',
                      pathname === `/projects/${project.id}` &&
                        'bg-primary text-primary-foreground'
                    )}
                  >
                    <span className="text-sm truncate block">
                      {project.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t text-xs text-muted-foreground">
          <p>Made with Claude Code</p>
        </div>
      </aside>
    </>
  );
}
