# SpecPilot AI

SpecPilot AI turns rough product ideas into execution-ready visual Markdown PRDs through a guided AI interview.

## Sprint 1 scope

This repository currently contains the monorepo scaffold, shared TypeScript types, and backend API foundation with mock responses.

No frontend implementation, authentication, public share links, database writes, or real AI provider calls are implemented in this phase.

## Requirements

- Node.js 20+
- pnpm

## Install

```bash
pnpm install
```

## Run backend

```bash
pnpm dev:backend
```

Backend defaults to `http://localhost:3001`.

## Scripts

```bash
pnpm dev
pnpm dev:backend
pnpm build
pnpm typecheck
pnpm lint
```

## Backend endpoints

- `GET /health`
- `POST /api/project/create`
- `POST /api/interview/question`
- `POST /api/interview/answer`
- `POST /api/prd/generate`
- `GET /api/prd/:session_id`

All request bodies are validated with Zod. Invalid requests return consistent JSON errors.
