# SpecPilot AI

SpecPilot AI turns rough product ideas into execution-ready visual Markdown PRDs through a guided AI interview.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-336791)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)
![9Router](https://img.shields.io/badge/AI-9Router-orange)
![Status](https://img.shields.io/badge/status-MVP-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

## Current Version

**v0.1.0 MVP**

This version includes the core idea input, guided interview flow, Markdown PRD generation, 9Router provider integration, and copy/download support.

## Status

SpecPilot AI is currently in MVP stage. The core flow is working, while provider selection, public sharing, and export formats are planned for future versions.

## Screenshots

### Homepage
![SpecPilot AI Homepage](./assets/screenshots/homepage.png)

### Idea Input
![SpecPilot AI Idea Input](./assets/screenshots/idea-input.png)

### Interview Flow
![SpecPilot AI Interview Flow](./assets/screenshots/interview-flow.png)

### PRD Result
![SpecPilot AI PRD Result](./assets/screenshots/prd-result.png)

## Requirements

- Node.js 20+
- pnpm
- PostgreSQL database

## Install

```bash
pnpm install
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `DIRECT_URL`: Direct PostgreSQL connection (for migrations)
- AI provider credentials (GROQ_API_KEY, OPENROUTER_API_KEY, or NINE_API_KEY)

## Run Development Server

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

## Scripts

```bash
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm typecheck              # Run TypeScript type checking
pnpm lint                   # Run ESLint
pnpm seed:demo              # Seed database with demo session
pnpm capture:screenshots    # Capture app screenshots (requires dev server running)
```

## API Endpoints

- `GET /api/health`
- `POST /api/project/create`
- `POST /api/interview/question`
- `POST /api/interview/answer`
- `POST /api/prd/generate`
- `GET /api/prd/:session_id`

All request bodies are validated with Zod. Invalid requests return consistent JSON errors.

## Features

- **AI-Guided Interview**: Interactive Q&A flow to understand your product vision
- **Visual PRD Generation**: Comprehensive PRDs with Mermaid diagrams, user stories, and technical architecture
- **Real-time Preview**: See your PRD build up as you answer questions
- **Multiple AI Providers**: Support for Groq, OpenRouter, and Nine AI
- **Local Database**: PostgreSQL storage with Prisma ORM
- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **AI**: Vercel AI SDK with multiple provider support
- **Markdown Rendering**: react-markdown with Mermaid diagram support
