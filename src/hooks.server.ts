import { building } from '$app/environment';
import { getAuth } from '$lib/server/auth';
import { getDb } from '$lib/server/db';
import { enforceRateLimit } from '$lib/server/rate-limit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const rateLimitHandler: Handle = async ({ event, resolve }) => {
	const limit = await enforceRateLimit(event, 'API_RATE_LIMIT');
	if (!limit.allowed) {
		return new Response(limit.message, {
			status: limit.status
		});
	}

	return resolve(event);
};

const handleDbConnection: Handle = async ({ event, resolve }) => {
	const db = await getDb();
	event.locals.db = db;

	return resolve(event);
};

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const auth = getAuth(event.locals.db);
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(rateLimitHandler, handleDbConnection, handleBetterAuth);
