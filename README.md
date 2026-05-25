# VivaFemini — Backend API

REST API for VivaFemini, built with **NestJS v11**, **Prisma v6**, and **SQLite** (dev) / **PostgreSQL** (prod).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [NestJS](https://nestjs.com) v11 |
| ORM | Prisma v6 |
| Database | SQLite (dev) · PostgreSQL (prod) |
| Auth | JWT + Passport |
| Validation | class-validator + class-transformer |
| Language | TypeScript (strict) |
| Package Manager | pnpm |
| Linting | ESLint + typescript-eslint |
| Git Hooks | Husky + lint-staged |

## API Modules

| Module | Base path | Description |
|--------|-----------|-------------|
| `auth` | `POST /api/auth/register` `POST /api/auth/login` `GET /api/auth/me` | JWT auth |
| `cycles` | `/api/cycles` | Cycle CRUD + `/current` + `/:id/predictions` |
| `tracking` | `/api/tracking-entries` | Daily symptom log CRUD + `/date/:date` |
| `symptoms` | `/api/symptoms` | Seeded symptom catalogue |
| `analytics` | `/api/analytics` | Symptom frequency, cycle trends, history |
| `health-reports` | `/api/health-reports` | Monthly report generation |

## Project Structure

```
src/
├── auth/
│   ├── dto/             # LoginDto, RegisterDto
│   ├── guards/          # JwtGuard
│   ├── strategies/      # JwtStrategy
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── cycles/              # Same pattern
├── tracking/            # Same pattern
├── symptoms/            # Same pattern
├── analytics/           # Same pattern
├── health-reports/      # Same pattern
└── prisma/              # PrismaService (global module)
prisma/
├── schema.prisma        # All data models
├── seed.ts              # 24 seeded symptoms
└── migrations/          # Migration history
```

## Getting Started

```bash
pnpm install
cp .env.example .env      # set DATABASE_URL + JWT_SECRET
pnpm db:migrate           # migrate + seed
pnpm start:dev            # http://localhost:4000/api
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite `file:./dev.db` or PostgreSQL URL | `file:./dev.db` |
| `JWT_SECRET` | JWT signing secret | — |
| `PORT` | Server port | `4000` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |

## Scripts

```bash
pnpm start:dev    # Dev (watch mode)
pnpm build        # Compile → dist/
pnpm start:prod   # Run compiled build
pnpm lint         # Lint + fix
pnpm lint:check   # Lint (CI)
pnpm test         # Unit tests
pnpm db:migrate   # Run migrations + seed
pnpm db:generate  # Regenerate Prisma Client
pnpm db:studio    # Prisma Studio GUI
```

## Code Quality

- **ESLint** — import ordering, TypeScript strict, no floating promises
- **Husky** — `lint-staged` on pre-commit (ESLint + `tsc --noEmit`)
- **Conventional commits** enforced via `commit-msg` hook

## Production Database

Switch `DATABASE_URL` to a PostgreSQL URL (Neon, Supabase, Railway) and change `schema.prisma` datasource provider to `"postgresql"`, then re-run `pnpm db:migrate`.

## Deployment

Deployed on **Vercel** as a Node.js serverless function. See `vercel.json`.
