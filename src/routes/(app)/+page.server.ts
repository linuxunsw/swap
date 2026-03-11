import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { enforceRateLimit } from '$lib/server/rate-limit';
import { log } from '$lib/log';
import { getDb } from '$lib/server/db';
import { application, applicationCycle } from '$lib/server/db/schema';
import { and, eq, lte, gte } from 'drizzle-orm';
import { getApplication } from '$lib/server/controllers/application';
import { getCurrentApplicationCycle } from '$lib/server/controllers/application-cycle';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	// get cycle and application for dashboard
	const db = getDb();
	const cycle = await getCurrentApplicationCycle(db);
	const application = await getApplication(db, event.locals.user.id);

	return { user: event.locals.user, cycle: cycle ?? null, application: application ?? null };
};
