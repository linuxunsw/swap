# swap 📝

Linux Society's portal for managing subcommittee applications.

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

3. Fill in required values in `.env`.

4. Create a local database:

    ```sh
    # Create a database named "swap" as the postgres user "postgres"
    createdb -U postgres swap
    # Or, do the same but in a docker container
    docker exec -it postgres-db-1 createdb -U postgres swap
    ```

5. Apply migrations to the database so it is ready to accept data:

    ```sh
    pnpm run db:migrate
    ```

6. Start the dev server:

    ```sh
    pnpm run dev
    ```

## Running with Worker Bindings Locally

Run a preview against the development environment. This provides a simulated Cloudflare Worker runtime and local bindings (miniflare):

```sh
pnpm run preview:mode:dev
```

## Database Workflow

Drizzle reads `DATABASE_URL` from the environment (`.env`), so ensure it targets the correct database before running commands. For now, Neon branch management is done through environment variables. In development, the DB connection fallback also uses `DATABASE_URL`, so it can point to either local Postgres or a Neon dev branch.

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
