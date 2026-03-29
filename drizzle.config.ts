import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './src/lib/server/db/migrations',
	casing: 'snake_case',
	dialect: 'postgresql',
	dbCredentials: { url: process.env.DATABASE_URL },
	migrations: {
		table: '__drizzle_migrations',
		schema: 'public'
	},
	verbose: true,
	strict: true
});
