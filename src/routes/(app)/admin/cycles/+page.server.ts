import { getApplicationCycles } from '$lib/server/controllers/application-cycle';
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
	const cycles = await getApplicationCycles(db);

	return {
		cycles: cycles,
		role: event.locals.user.role
	};
};
