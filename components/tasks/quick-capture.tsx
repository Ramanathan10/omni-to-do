'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/stores/task-store';

export function QuickCapture() {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTask = useTaskStore((state) => state.createTask);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const task = await createTask({
      title: title.trim(),
      status: 'inbox',
    });

    if (task) {
      setTitle('');
    }
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Quick capture: type a task and press Enter..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        className="flex-1"
        autoFocus
      />
      <Button
        type="submit"
        size="icon"
        disabled={!title.trim() || isSubmitting}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}
