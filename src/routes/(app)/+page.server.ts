import { getApplication } from '$lib/server/controllers/application';
import { getApplicantCycleAccess } from '$lib/server/controllers/application-cycle';
import { getApplicationSubcommitteeNames } from '$lib/server/controllers/subcommittee';
import { getDb } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	if (event.locals.user.role === 'admin') {
		return redirect(302, '/admin');
	}

	const db = getDb();
	const access = await getApplicantCycleAccess(db, event.locals.user.id);
	if (!access.effectiveCycleForUser) {
		return redirect(302, '/closed');
	}

	const app = await getApplication(db, event.locals.user.id, access.effectiveCycleForUser);

	const subcommitteeNames = app ? await getApplicationSubcommitteeNames(db, app.id) : [];

	return {
		cycle: access.effectiveCycleForUser,
		isWithinSubmissionWindow: access.isWithinSubmissionWindow,
		application: app ?? null,
		subcommitteeNames
	};
};
