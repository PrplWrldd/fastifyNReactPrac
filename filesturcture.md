# filestructure

taskflow/
├── backend/
│   ├── index.ts
│   ├── plugins/
│   │   ├── db.ts          # Bun SQLite, creates tasks + users tables
│   │   ├── auth.ts        # @fastify/jwt setup + authenticate decorator
│   └── routes/
│       ├── tasks.ts       # CRUD /tasks
│       └── auth.ts        # POST /auth/register, /auth/login
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── TaskBoard.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskForm.tsx
│   │   └── hooks/
│   │       └── useTasks.ts
└── package.json