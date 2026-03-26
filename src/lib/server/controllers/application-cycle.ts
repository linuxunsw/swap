import { log } from '$lib/log';
import { and, eq, gte, inArray, lte } from 'drizzle-orm/sql/expressions/conditions';
import type { SwapDb } from '../db';
import { application, applicationCycle, applicationCycle_subcommittee } from '../db/schema';

export type ApplicationCycleRecord = typeof applicationCycle.$inferSelect;

export type ApplicantCycleAccess = {
	currentCycle: ApplicationCycleRecord | null;
	latestCycle: ApplicationCycleRecord | null;
	effectiveCycleForUser: ApplicationCycleRecord | null;
	isWithinSubmissionWindow: boolean;
	hasApplicationInLatestCycle: boolean;
};

export const getApplicationCycles = async (db: SwapDb) => {
	const cycles = await db.query.applicationCycle.findMany({
		with: {
			subcommittees: {
				columns: {},
				with: {
					subcommittee: true
				}
			}
		},
		orderBy: (table, { desc }) => [desc(table.opensAt)]
	});

	return cycles;
};

export type ApplicationCycleWithSubcommittees = Awaited<
	ReturnType<typeof getApplicationCycles>
>[number];

export const getApplicationCycleById = async (db: SwapDb, id: string) => {
	return db.query.applicationCycle.findFirst({
		where: eq(applicationCycle.id, id),
		with: {
			subcommittees: {
				columns: {},
				with: {
					subcommittee: true
				}
			}
		}
	});
};

export const getCurrentApplicationCycle = async (db: SwapDb) => {
	const now = new Date();

	const cycle = await db.query.applicationCycle.findFirst({
		where: and(lte(applicationCycle.opensAt, now), gte(applicationCycle.closesAt, now)),
		orderBy: (table, { desc }) => [desc(table.opensAt)]
	});

	return cycle ?? null;
};

export const getLatestApplicationCycle = async (db: SwapDb) => {
	const now = new Date();

	const cycle = await db.query.applicationCycle.findFirst({
		where: lte(applicationCycle.opensAt, now),
		orderBy: (table, { desc }) => [desc(table.opensAt)]
	});

	return cycle ?? null;
};

export const isCycleOpenForSubmissions = (
	cycle: Pick<ApplicationCycleRecord, 'opensAt' | 'closesAt'> | null,
	now: Date = new Date()
) => {
	if (!cycle) {
		return false;
	}

	return cycle.opensAt <= now && cycle.closesAt >= now;
};

export const getApplicantCycleAccess = async (
	db: SwapDb,
	userId: string
): Promise<ApplicantCycleAccess> => {
	const latestCycle = await getLatestApplicationCycle(db);
	if (!latestCycle) {
		return {
			currentCycle: null,
			latestCycle: null,
			effectiveCycleForUser: null,
			isWithinSubmissionWindow: false,
			hasApplicationInLatestCycle: false
		};
	}

	const existingApplication = await db.query.application.findFirst({
		where: and(eq(application.userId, userId), eq(application.cycleId, latestCycle.id)),
		columns: { id: true }
	});

	const hasApplicationInLatestCycle = !!existingApplication;
	const isWithinSubmissionWindow = isCycleOpenForSubmissions(latestCycle);
	const currentCycle = isWithinSubmissionWindow ? latestCycle : null;

	return {
		currentCycle,
		latestCycle,
		effectiveCycleForUser:
			isWithinSubmissionWindow || hasApplicationInLatestCycle ? latestCycle : null,
		isWithinSubmissionWindow,
		hasApplicationInLatestCycle
	};
};

export const createCycleWithSubcommittees = async (
	db: SwapDb,
	data: typeof applicationCycle.$inferInsert & { subcommitteeIds: string[] }
) => {
	const cycle = await db.transaction(async (tx) => {
		const [cycle] = await tx
			.insert(applicationCycle)
			.values({
				name: data.name,
				opensAt: data.opensAt,
				closesAt: data.closesAt
			})
			.returning();

		if (data.subcommitteeIds.length > 0) {
			await tx.insert(applicationCycle_subcommittee).values(
				data.subcommitteeIds.map((subcommitteeId) => ({
					cycleId: cycle.id,
					subcommitteeId
				}))
			);
		}
		return cycle;
	});

	return cycle;
};

export const updateCycleWithSubcommittees = async (
	db: SwapDb,
	cycleId: string,
	data: typeof applicationCycle.$inferInsert & { subcommitteeIds: string[] }
) => {
	const cycle = await db.transaction(async (tx) => {
		const [cycle] = await tx
			.update(applicationCycle)
			.set({
				name: data.name,
				opensAt: data.opensAt,
				closesAt: data.closesAt
			})
			.where(eq(applicationCycle.id, cycleId))
			.returning();

		// Sync join-table rows (only delete/insert what changed)
		const existingLinks = await tx.query.applicationCycle_subcommittee.findMany({
			where: eq(applicationCycle_subcommittee.cycleId, cycleId),
			columns: { subcommitteeId: true }
		});

		log('debug', 'cycle', 'update_cycle_subcommittees', {
			cycleId,
			existingSubcommitteeIds: existingLinks.map((r) => r.subcommitteeId).toString(),
			newSubcommitteeIds: data.subcommitteeIds.toString()
		});
		const existingIds = new Set(existingLinks.map((r) => r.subcommitteeId));
		const nextIds = new Set(data.subcommitteeIds);

		const toAdd = data.subcommitteeIds.filter((id) => !existingIds.has(id));
		const toRemove = existingLinks.map((r) => r.subcommitteeId).filter((id) => !nextIds.has(id));

		if (toRemove.length > 0) {
			await tx
				.delete(applicationCycle_subcommittee)
				.where(
					and(
						eq(applicationCycle_subcommittee.cycleId, cycleId),
						inArray(applicationCycle_subcommittee.subcommitteeId, toRemove)
					)
				);
		}

		if (toAdd.length > 0) {
			await tx.insert(applicationCycle_subcommittee).values(
				toAdd.map((subcommitteeId) => ({
					cycleId,
					subcommitteeId
				}))
			);
		}

		return cycle;
	});

	return cycle;
};

export const deleteApplicationCycle = async (db: SwapDb, cycleId: string) => {
	return db.delete(applicationCycle).where(eq(applicationCycle.id, cycleId));
};
