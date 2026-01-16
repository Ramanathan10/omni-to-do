import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { updateTaskSchema } from '@/lib/validations/task';
import { z } from 'zod';

// GET /api/tasks/:id - Get a single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/:id - Update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    // Convert date strings to Date objects if present
    const updateData: any = { ...validatedData };

    if (validatedData.dueDate !== undefined) {
      updateData.dueDate = validatedData.dueDate ? new Date(validatedData.dueDate) : null;
    }
    if (validatedData.deferDate !== undefined) {
      updateData.deferDate = validatedData.deferDate ? new Date(validatedData.deferDate) : null;
    }
    if (validatedData.completedAt !== undefined) {
      updateData.completedAt = validatedData.completedAt
        ? new Date(validatedData.completedAt)
        : null;
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        children: true,
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id - Delete a task (cascades to children)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
