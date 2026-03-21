import { and, eq, gte, lte } from 'drizzle-orm/sql/expressions/conditions';
import type { SwapDb } from '../db';
import { application, applicationCycle } from '../db/schema';

export type ApplicationCycleRecord = typeof applicationCycle.$inferSelect;

export type ApplicantCycleAccess = {
	currentCycle: ApplicationCycleRecord | null;
	latestCycle: ApplicationCycleRecord | null;
	effectiveCycleForUser: ApplicationCycleRecord | null;
	isWithinSubmissionWindow: boolean;
	hasApplicationInLatestCycle: boolean;
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

export const createApplicationCycle = async (
	db: SwapDb,
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
