import type { getDb } from '$lib/server/db';
import { application_subcommittee, subcommittee } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export type SubcommitteeOption = {
	id: string;
	name: string;
};

export async function getSubcommitteeOptions(
	db: ReturnType<typeof getDb>
): Promise<SubcommitteeOption[]> {
	return db.query.subcommittee.findMany({
		columns: {
			id: true,
			name: true
		},
		orderBy: (table, { asc }) => [asc(table.name)]
	});
}

export function toSubcommitteeNameMap(options: SubcommitteeOption[]): Record<string, string> {
	return Object.fromEntries(options.map(({ id, name }) => [id, name]));
}

export async function getApplicationSubcommitteeIds(
	db: ReturnType<typeof getDb>,
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
	db: ReturnType<typeof getDb>,
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
