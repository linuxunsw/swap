import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getCurrentApplicationCycle } from '$lib/server/controllers/application-cycle';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const db = getDb();
	const cycle = await getCurrentApplicationCycle(db);
	if (cycle) {
		return redirect(302, '/');
	}

	return {
		zid: event.locals.user.zid
	};
};
