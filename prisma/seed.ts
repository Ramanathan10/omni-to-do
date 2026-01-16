import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { addDays } from 'date-fns';

// Create LibSQL adapter for Turso
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create projects
  const personalProject = await prisma.project.create({
    data: {
      title: 'Personal',
      description: 'Personal tasks and errands',
      status: 'active',
    },
  });

  const workProject = await prisma.project.create({
    data: {
      title: 'Work Projects',
      description: 'Professional work and projects',
      status: 'active',
    },
  });

  const somedayProject = await prisma.project.create({
    data: {
      title: 'Learn Piano',
      description: 'Someday I want to learn piano',
      status: 'someday',
    },
  });

  console.log('Created projects:', { personalProject, workProject, somedayProject });

  // Create inbox tasks (unprocessed)
  await prisma.task.create({
    data: {
      title: 'Review project proposal',
      status: 'inbox',
    },
  });

  await prisma.task.create({
    data: {
      title: 'Call dentist for appointment',
      status: 'inbox',
    },
  });

  // Create active tasks with various defer/due dates
  const today = new Date();

  // Task available now (no defer date)
  await prisma.task.create({
    data: {
      title: 'Buy groceries',
      notes: 'Milk, eggs, bread, vegetables',
      status: 'active',
      dueDate: addDays(today, 2),
      projectId: personalProject.id,
    },
  });

  // Task available now (defer date in past)
  await prisma.task.create({
    data: {
      title: 'Finish quarterly report',
      status: 'active',
      deferDate: addDays(today, -2),
      dueDate: addDays(today, 3),
      projectId: workProject.id,
    },
  });

  // Task NOT available yet (defer date in future)
  await prisma.task.create({
    data: {
      title: 'Prepare for next week meeting',
      notes: 'Review agenda and prepare slides',
      status: 'active',
      deferDate: addDays(today, 3),
      dueDate: addDays(today, 7),
      projectId: workProject.id,
    },
  });

  // Overdue task
  await prisma.task.create({
    data: {
      title: 'Submit expense report',
      status: 'active',
      dueDate: addDays(today, -1),
      projectId: workProject.id,
    },
  });

  // Task with hierarchy (parent-child)
  const parentTask = await prisma.task.create({
    data: {
      title: 'Plan birthday party',
      status: 'active',
      dueDate: addDays(today, 14),
      projectId: personalProject.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Create guest list',
      status: 'active',
      parentId: parentTask.id,
      projectId: personalProject.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Book venue',
      status: 'active',
      parentId: parentTask.id,
      projectId: personalProject.id,
    },
  });

  // Someday tasks
  await prisma.task.create({
    data: {
      title: 'Research piano teachers',
      status: 'someday',
      projectId: somedayProject.id,
    },
  });

  // Completed task
  await prisma.task.create({
    data: {
      title: 'Send team update email',
      status: 'completed',
      completedAt: addDays(today, -1),
      projectId: workProject.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
