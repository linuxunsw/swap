import { getApplication } from '$lib/server/controllers/application';
import { getCurrentApplicationCycle } from '$lib/server/controllers/application-cycle';
import { getApplicationSubcommitteeNames } from '$lib/server/controllers/subcommittee';
import { getDb } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const db = getDb();
	const cycle = await getCurrentApplicationCycle(db);
	if (!cycle) {
		return redirect(302, '/closed');
	}

	const app = await getApplication(db, event.locals.user.id, cycle);

	const subcommitteeNames = app ? await getApplicationSubcommitteeNames(db, app.id) : [];

	return {
		user: event.locals.user,
		cycle: cycle ?? null,
		application: app ?? null,
		subcommitteeNames
	};
};
