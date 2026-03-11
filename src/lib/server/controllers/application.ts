import type { getDb } from '$lib/server/db';
import { and, eq, inArray } from 'drizzle-orm/sql/expressions/conditions';
import { application, application_subcommittee, applicationCycle } from '../db/schema';
import { getCurrentApplicationCycle } from './application-cycle';
import { log } from '$lib/log';

export const getApplication = async (
	db: ReturnType<typeof getDb>,
	userId: string,
	cycle?: typeof applicationCycle.$inferSelect
) => {
	if (!cycle) {
		cycle = await getCurrentApplicationCycle(db);
		if (!cycle) return null;
	}

	return db.query.application.findFirst({
		where: and(eq(application.userId, userId), eq(application.cycleId, cycle.id))
	});
};

export const createOrUpdateApplication = async (
	db: ReturnType<typeof getDb>,
	userId: string,
	data: {
		fullName: string;
		discord: string;
		preferredEmail: string;
		subcommittees: string[];
		reason: string;
		experience: string;
	}
) => {
	const cycle = await getCurrentApplicationCycle(db);
	if (!cycle) throw new Error('No active application cycle');

	const app = await db.transaction(async (tx) => {
		const existing = await tx.query.application.findFirst({
			where: and(eq(application.userId, userId), eq(application.cycleId, cycle.id))
		});

		let savedApp: typeof application.$inferSelect;

		if (existing) {
			if (existing.status !== 'draft' && existing.status !== 'submitted') {
				throw new Error('Only draft or submitted applications can be edited');
			}

			const [updated] = await tx
				.update(application)
				.set({
					fullName: data.fullName,
					discord: data.discord,
					preferredEmail: data.preferredEmail || null,
					reason: data.reason,
					experience: data.experience,
					status: 'draft',
					submittedAt: null
				})
				.where(eq(application.id, existing.id))
				.returning();

			savedApp = updated;
		} else {
			const [created] = await tx
				.insert(application)
				.values({
					userId: userId,
					cycleId: cycle.id,
					fullName: data.fullName,
					discord: data.discord,
					preferredEmail: data.preferredEmail || null,
					reason: data.reason,
					experience: data.experience,
					status: 'draft'
				})
				.returning();

			savedApp = created;
		}

		// Sync join-table rows (only delete/insert what changed)
		const existingLinks = await tx.query.application_subcommittee.findMany({
			where: eq(application_subcommittee.applicationId, savedApp.id),
			columns: { subcommitteeId: true }
		});

		const existingIds = new Set(existingLinks.map((r) => r.subcommitteeId));
		const nextIds = new Set(data.subcommittees);

		const toInsert = data.subcommittees.filter((id) => !existingIds.has(id));
		const toDelete = existingLinks.map((r) => r.subcommitteeId).filter((id) => !nextIds.has(id));

		if (toDelete.length > 0) {
			await tx
				.delete(application_subcommittee)
				.where(
					and(
						eq(application_subcommittee.applicationId, savedApp.id),
						inArray(application_subcommittee.subcommitteeId, toDelete)
					)
				);
		}

		if (toInsert.length > 0) {
			await tx.insert(application_subcommittee).values(
				toInsert.map((subcommitteeId) => ({
					applicationId: savedApp.id,
					subcommitteeId
				}))
			);
		}

		return savedApp;
	});

	return app;
};

export const submitApplication = async (db: ReturnType<typeof getDb>, userId: string) => {
	const draft = await getApplication(db, userId);
	if (!draft) throw new Error('No application to submit');
	if (draft.status !== 'draft') throw new Error('Only draft applications can be submitted');

	const [updated] = await db
		.update(application)
		.set({ status: 'submitted', submittedAt: new Date() })
		.where(eq(application.id, draft.id))
		.returning();

	return updated;
};
