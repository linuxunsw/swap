# swap 📝

Linux Society's portal for managing subcommittee applications.

SWAP is a SvelteKit app used to run subcommittee application cycles, from applicant submission to admin review and status tracking.

## Features

- zID email OTP authentication
- applicant-facing application flow and status timeline
- admin dashboard for cycles, subcommittees, and applicant management
- Cloudflare Worker deployment with Hyperdrive, KV, and rate limit bindings

## Tech Stack

- SvelteKit + Svelte 5
- Better Auth (email OTP)
- Drizzle ORM + PostgreSQL (Neon Serverless)
- Cloudflare Workers + Wrangler
- Tailwind CSS 4
- Shadcn-Svelte UI components

## Local Setup

1. Install dependencies:

```sh
pnpm install
```

2. Create local environment variables:

```sh
cp .env.example .env
```

3. Fill in required values in `.env` (at minimum `DATABASE_URL`, auth secrets, and app origin).

4. Start the dev server:

```sh
pnpm run dev
```

## Running with Worker Bindings Locally

Use this when you want to test against a simulated Cloudflare Worker runtime and local bindings. e.g testing rate limits.

```sh
pnpm run preview:mode:dev
```

## Database Workflow

Drizzle uses `DATABASE_URL` from your environment.

```sh
# create migration files from schema changes
pnpm run db:generate

# apply migrations
pnpm run db:migrate

# push schema directly (use with care)
pnpm run db:push

# open Drizzle Studio
pnpm run db:studio
```

## Production Build and Preview

1. Prepare production environment values:

```sh
cp .env .env.production
```

2. Build:

```sh
pnpm run build
```

3. Preview production worker locally:

```sh
pnpm run preview
```

## Deploy

After confirming production env values and database state:

```sh
pnpm run deploy
```