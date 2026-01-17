import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Load .env.local explicitly (before dotenv/config)
config({ path: '.env.local', override: true });

const client = createClient({
  url: process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDatabase() {
  console.log('Initializing Turso database...');
  console.log('Database URL:', process.env.DATABASE_URL);

  try {
    // Create Project table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS Project (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created Project table');

    // Create Task table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS Task (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'inbox',
        dueDate DATETIME,
        deferDate DATETIME,
        completedAt DATETIME,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        projectId TEXT,
        parentId TEXT,
        sortOrder INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE,
        FOREIGN KEY (parentId) REFERENCES Task(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Created Task table');

    // Create indexes
    await client.execute('CREATE INDEX IF NOT EXISTS Project_status_idx ON Project(status);');
    await client.execute('CREATE INDEX IF NOT EXISTS Task_status_idx ON Task(status);');
    await client.execute('CREATE INDEX IF NOT EXISTS Task_projectId_idx ON Task(projectId);');
    await client.execute('CREATE INDEX IF NOT EXISTS Task_parentId_idx ON Task(parentId);');
    await client.execute('CREATE INDEX IF NOT EXISTS Task_deferDate_idx ON Task(deferDate);');
    await client.execute('CREATE INDEX IF NOT EXISTS Task_dueDate_idx ON Task(dueDate);');
    await client.execute('CREATE INDEX IF NOT EXISTS Task_status_deferDate_dueDate_idx ON Task(status, deferDate, dueDate);');
    console.log('✓ Created indexes');

    console.log('\n✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
