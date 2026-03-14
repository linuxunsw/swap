import { getCurrentApplicationCycle } from '$lib/server/controllers/application-cycle';
import { getDb } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	if (event.locals.user.role !== 'admin') {
		return redirect(302, '/');
	}

	const db = getDb();

	const cycle = await getCurrentApplicationCycle(db);

	return {
		cycle: cycle ?? null,
		role: event.locals.user.role
	};
};

export const actions: Actions = {
	default: async (event) => {
		return setFlash('you did a thing', event);
	}
};
