'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectList } from '@/components/projects/project-list';
import { useProjectStore } from '@/stores/project-store';
import { useUIStore } from '@/stores/ui-store';

export default function ProjectsPage() {
  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const isLoading = useProjectStore((state) => state.isLoading);
  const openProjectForm = useUIStore((state) => state.openProjectForm);

  const [activeTab, setActiveTab] = useState<'active' | 'someday'>('active');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const activeProjects = projects.filter((p) => p.status === 'active');
  const somedayProjects = projects.filter((p) => p.status === 'someday');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Organize your tasks into projects
          </p>
        </div>
        <Button onClick={() => openProjectForm()}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading projects...
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="active">
              Active ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="someday">
              Someday ({somedayProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <ProjectList
              projects={activeProjects}
              emptyMessage="No active projects. Create one to get started!"
            />
          </TabsContent>

          <TabsContent value="someday" className="mt-6">
            <ProjectList
              projects={somedayProjects}
              emptyMessage="No someday projects. These are for future ideas and goals."
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
