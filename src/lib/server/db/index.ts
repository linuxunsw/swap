import { drizzle as drizzleLibSql } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

export function getDb() {
	if (env.DB) {
		return drizzleD1(env.DB as any);
	}

	if (env.DATABASE_URL) {
		const client = createClient({ url: env.DATABASE_URL });
		return drizzleLibSql(client, { schema });
	}

	throw new Error('No valid db config!');
}

export type DrizzleClient = ReturnType<typeof getDb>;
