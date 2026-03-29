import { log } from '$lib/log';
import { getAuth } from '$lib/server/auth';
import { enforceRateLimit } from '$lib/server/rate-limit';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/login');
		}

		const limit = await enforceRateLimit(event, 'AUTH_RATE_LIMIT');
		if (!limit.allowed) {
			error(limit.status, { message: limit.message });
		}

		const db = event.locals.db;
		const auth = getAuth(db);

		await auth.api.signOut({
			headers: event.request.headers
		});
		log('info', 'page', 'sign_out', { zid: event.locals.user?.zid });
		return redirect(302, '/login');
	}
};
