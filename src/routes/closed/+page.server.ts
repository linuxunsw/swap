import { getApplicantCycleAccess } from '$lib/server/controllers/application-cycle';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const db = event.locals.db;
	const access = await getApplicantCycleAccess(db, event.locals.user.id);
	if (access.effectiveCycleForUser) {
		return redirect(302, '/');
	}

	return {
		zid: event.locals.user.zid
	};
};
