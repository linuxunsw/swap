import {
	HYPERDRIVE,
	CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE,
	DATABASE_URL
} from '$app/env/private';

import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { log } from '../../log';
import * as schema from './schema';

export async function getDb() {
	if (HYPERDRIVE) {
		log('debug', 'db', 'get', { provider: 'hyperdrive' });

		const db = HYPERDRIVE as unknown as Hyperdrive;
		const connectionString =
			CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE ?? db.connectionString;
		const client = new Client({ connectionString });

		await client.connect();
		return drizzlePostgres(client, { schema, casing: 'snake_case' });
	}

	// Fallback to direct postgres if hyperdrive is not available (e.g. local non-miniflare development)
	if (DATABASE_URL) {
		log('debug', 'db', 'get', { provider: 'node-postgres' });

		const client = new Client({ connectionString: DATABASE_URL });

		await client.connect();
		return drizzlePostgres(client, { schema, casing: 'snake_case' });
	}

	log('error', 'db', 'init_failed', { message: 'No db config available' });
	throw new Error('No db config available');
}

export type SwapDb = Awaited<ReturnType<typeof getDb>>;
