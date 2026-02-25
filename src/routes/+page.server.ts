import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { enforceRateLimit } from '$lib/server/rate-limit';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	signOut: async (event) => {
		const limit = await enforceRateLimit(event, 'API_RATE_LIMIT');
		if (!limit.allowed) {
			error(limit.status, { message: limit.message });
		}

		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/login');
	}
};
