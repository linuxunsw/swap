import type { SwapDb } from '$lib/server/db';
import {
	application_subcommittee,
	applicationCycle_subcommittee,
	subcommittee
} from '$lib/server/db/schema';
import { eq, getTableColumns } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export type SubcommitteeOption = typeof subcommittee.$inferSelect;

export async function createSubcommittee(
	db: SwapDb,
	id: string,
	name: string,
	description?: string
): Promise<SubcommitteeOption> {
	const entry = await db.insert(subcommittee).values({ id, name, description }).returning();
	return entry[0];
}

export async function getAllSubcommitteeOptions(db: SwapDb): Promise<SubcommitteeOption[]> {
	return db.query.subcommittee.findMany({
		orderBy: (table, { asc }) => [asc(table.name)]
	});
}

export async function getSubcommitteeOptionsByCycle(
	db: SwapDb,
	cycleId: string
): Promise<SubcommitteeOption[]> {
	// force cast to fix type error on the partial select. this is because SelectedFields is
	// incompatible between the drizzle adapters, and prevents proper inference for select()
	const dbD1 = db as unknown as DrizzleD1Database;

	const cols = getTableColumns(subcommittee);
	return dbD1
		.select({ ...cols })
		.from(subcommittee)
		.innerJoin(
			applicationCycle_subcommittee,
			eq(subcommittee.id, applicationCycle_subcommittee.subcommitteeId)
		)
		.where(eq(applicationCycle_subcommittee.cycleId, cycleId))
		.orderBy(subcommittee.name);
}

export function toSubcommitteeNameMap(options: SubcommitteeOption[]): Record<string, string> {
	return Object.fromEntries(options.map(({ id, name }) => [id, name]));
}

export async function getApplicationSubcommitteeIds(
	db: SwapDb,
	applicationId: string
): Promise<string[]> {
	const rows = await db.query.application_subcommittee.findMany({
		where: eq(application_subcommittee.applicationId, applicationId),
		columns: {
			subcommitteeId: true
		}
	});

	return rows.map((row) => row.subcommitteeId);
}

export async function getApplicationSubcommitteeNames(
	db: SwapDb,
	applicationId: string
): Promise<string[]> {
	const rows = await db.query.application_subcommittee.findMany({
		where: eq(application_subcommittee.applicationId, applicationId),
		with: {
			subcommittee: {
				columns: {
					name: true
				}
			}
		}
	});

	return rows.map((row) => row.subcommittee.name);
}
