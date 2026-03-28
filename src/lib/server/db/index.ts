import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { log } from '../../log';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export function getDb() {
	let hyperdrive: { connectionString?: string } | undefined;

	try {
		// get the hyperdrive db connection string
		const event = getRequestEvent();
		const platformEnv = event.platform?.env as Record<string, unknown> | undefined;
		hyperdrive = platformEnv?.HYPERDRIVE as { connectionString?: string } | undefined;
	} catch {
		// not an active request
	}

	const connectionString =
		hyperdrive?.connectionString ?? env.CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE;

	if (!connectionString) {
		log('error', 'db', 'init_failed', {
			message: 'No DB connection available (HYPERDRIVE binding, local connection string)'
		});
		throw new Error('No DB connection available (HYPERDRIVE binding, local connection string)');
	}

	const sql = postgres(connectionString, { prepare: false, max: 1 });
	return drizzlePostgres(sql, { schema, casing: 'snake_case' });
}

export type SwapDb = ReturnType<typeof getDb>;
