# Omni To-Do

An OmniFocus-inspired task management web application built with Next.js.

## Features

- Quick task capture to inbox
- Projects with task hierarchy
- Defer dates and due dates
- "Available tasks" perspective showing only actionable items
- Someday/Maybe for future projects and tasks

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Prisma + SQLite
- Tailwind CSS
- shadcn/ui
- Zustand

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
cp .env.example .env.local
npx prisma migrate dev
npx prisma db seed
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)

## License

MIT
