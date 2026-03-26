import { getApplications } from '$lib/server/controllers/application';
import { getLatestApplicationCycle } from '$lib/server/controllers/application-cycle';
import { getApplicationSubcommittees } from '$lib/server/controllers/subcommittee';
import { getDb } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	if (event.locals.user.role !== 'admin') {
		return redirect(302, '/');
	}

	const db = getDb();

	const cycle = await getLatestApplicationCycle(db);
	if (!cycle) {
		return {
			cycle: null,
			role: event.locals.user.role,
			applicants: []
		};
	}

	const applicants = await getApplications(db, cycle);
	const mappedApplicants = await Promise.all(
		applicants.map(async (app) => {
			const subcommittees = await getApplicationSubcommittees(db, app.id);
			return {
				id: app.id,
				name: app.fullName,
				status: app.status,
				subcommittees: subcommittees
			};
		})
	);

	return {
		cycle: cycle,
		role: event.locals.user.role,
		applicants: mappedApplicants
	};
};
