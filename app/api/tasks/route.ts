import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { createTaskSchema } from '@/lib/validations/task';
import { filterAvailableTasks } from '@/lib/utils/date-filters';
import { z } from 'zod';

// GET /api/tasks - List tasks with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const view = searchParams.get('view');
    const projectId = searchParams.get('projectId');

    // Build where clause
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (projectId) {
      where.projectId = projectId;
    }

    // Fetch tasks
    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: true,
        children: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // Apply view filter if specified
    if (view === 'available') {
      const availableTasks = filterAvailableTasks(tasks);
      return NextResponse.json({ tasks: availableTasks });
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    // Convert date strings to Date objects if present
    const taskData: any = {
      ...validatedData,
    };

    if (validatedData.dueDate) {
      taskData.dueDate = new Date(validatedData.dueDate);
    }
    if (validatedData.deferDate) {
      taskData.deferDate = new Date(validatedData.deferDate);
    }

    const task = await prisma.task.create({
      data: taskData,
      include: {
        project: true,
        children: true,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
