import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { enforceRateLimit } from '$lib/server/rate-limit';
import { log } from '$lib/log';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	signOut: async (event) => {
		const limit = await enforceRateLimit(event, 'AUTH_RATE_LIMIT');
		if (!limit.allowed) {
			error(limit.status, { message: limit.message });
		}

		await auth.api.signOut({
			headers: event.request.headers
		});
		log('info', 'page', 'sign_out', { zid: event.locals.user?.zid });
		return redirect(302, '/login');
	}
};
