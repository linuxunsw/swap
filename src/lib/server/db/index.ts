import { env } from '$env/dynamic/private';
import { log } from '$lib/log';
import { createClient } from '@libsql/client';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle as drizzleLibSql } from 'drizzle-orm/libsql';
import * as schema from './schema';

export function getDb() {
	if (env.DB) {
		log('debug', 'db', 'get', { provider: 'd1' });
		return drizzleD1(env.DB as unknown as D1Database, { schema });
	}

	if (env.DATABASE_URL) {
		log('debug', 'db', 'get', { provider: 'libsql' });
		const client = createClient({ url: env.DATABASE_URL });
		return drizzleLibSql(client, { schema });
	}

	log('error', 'db', 'init_failed', { message: 'No valid db config' });
	throw new Error('No valid db config!');
}

export type SwapDb = ReturnType<typeof getDb>;
