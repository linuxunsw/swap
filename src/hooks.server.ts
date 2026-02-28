import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { enforceRateLimit } from '$lib/server/rate-limit';
import { sequence } from '@sveltejs/kit/hooks';

const rateLimitHandler: Handle = async ({ event, resolve }) => {
	const limit = await enforceRateLimit(event, 'API_RATE_LIMIT');
	if (!limit.allowed) {
		return new Response(limit.message, {
			status: limit.status
		});
	}

	return resolve(event);
}

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(rateLimitHandler, handleBetterAuth);
