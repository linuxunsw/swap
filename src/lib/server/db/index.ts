import { env } from '$env/dynamic/private';
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { log } from '../../log';
import * as schema from './schema';

export async function getDb() {
	if (env.HYPERDRIVE) {
		log('debug', 'db', 'get', { provider: 'hyperdrive' });
		const db = env.HYPERDRIVE as unknown as Hyperdrive;

		const connectionString =
			env.CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE ?? db.connectionString;

		const client = new Client({
			connectionString
		});

		await client.connect();
		return drizzlePostgres(client, { schema, casing: 'snake_case' });
	}

	// Fallback to direct postgres if hyperdrive is not available (e.g. local non-miniflare development)
	if (env.DATABASE_URL) {
		log('debug', 'db', 'get', { provider: 'node-postgres' });
		const client = new Client({
			connectionString: env.DATABASE_URL
		});
		await client.connect();
		return drizzlePostgres(client, { schema, casing: 'snake_case' });
	}

	log('error', 'db', 'init_failed', { message: 'No db config available' });
	throw new Error('No db config available');
}

export type SwapDb = Awaited<ReturnType<typeof getDb>>;
