import { getApplicationCycles } from '$lib/server/controllers/application-cycle';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	if (event.locals.user.role !== 'admin') {
		return redirect(302, '/');
	}

	const db = event.locals.db;
	const cycles = await getApplicationCycles(db);

	return {
		cycles: cycles,
		role: event.locals.user.role
	};
};
