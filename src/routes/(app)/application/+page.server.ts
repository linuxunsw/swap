import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getApplication } from '$lib/server/controllers/application';
import { getApplicationSubcommitteeNames } from '$lib/server/controllers/subcommittee';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const db = getDb();
	const app = await getApplication(db, event.locals.user.id);

	const subcommitteeNames = app ? await getApplicationSubcommitteeNames(db, app.id) : [];

	return {
		application: app ?? null,
		subcommitteeNames,
		userEmail: event.locals.user.email
	};
};
