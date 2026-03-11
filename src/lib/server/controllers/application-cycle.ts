import { and, gte, lte } from 'drizzle-orm/sql/expressions/conditions';
import type { getDb } from '../db';
import { applicationCycle } from '../db/schema';

export const getCurrentApplicationCycle = async (db: ReturnType<typeof getDb>) => {
	const now = new Date();

	const cycle = await db.query.applicationCycle.findFirst({
		where: and(lte(applicationCycle.opensAt, now), gte(applicationCycle.closesAt, now))
	});

	return cycle;
};

export const createApplicationCycle = async (
	db: ReturnType<typeof getDb>,
	name: string,
	opensAt: Date,
	closesAt: Date
) => {
	const [cycle] = await db
		.insert(applicationCycle)
		.values({
			name,
			opensAt,
			closesAt
		})
		.returning();

	return cycle;
};
