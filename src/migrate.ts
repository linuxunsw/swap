// migrates the neon DB - this is run instead of doing drizzle-kit migrate
// or something similar
//
// requires the neon DB url
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { config } from 'dotenv';

config({ path: '.env' });

/*
 * migrates the neon DB - this is run instead of doing drizzle-kit migrate/push or similar
 * migrations still need to be generated manually, this script is used to push them
 *
 * WHEN TESTING - make a new branch on the neon db and test migrations there, shouldn't need
 * to test locally w/ pg
 */
const main = async () => {
	try {
		if (!process.env.NEON_DATABASE_URL) throw new Error('NEON_DATABASE_URL is not set.');
		const sql = neon(process.env.NEON_DATABASE_URL!);
		const db = drizzle(sql);

		await migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
		console.log('Migration completed');
	} catch (error) {
		// this always fails, idk why but the migrations work
		console.error('Error during migration:', error);
		process.exit(1);
	}
};

main();
