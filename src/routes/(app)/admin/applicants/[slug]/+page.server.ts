import { getApplicationById } from '$lib/server/controllers/application';
import { getDb } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	if (event.locals.user.role !== 'admin') {
		return redirect(302, '/');
	}

	const db = getDb();

	const validator = v.pipe(v.string(), v.uuid());
	const result = v.safeParse(validator, event.params.slug);
	if (!result.success) {
		error(400, 'Invalid application ID');
	}

	const application = await getApplicationById(db, event.params.slug);

	return {
		role: event.locals.user.role,
		slug: event.params.slug,
		application
	};
};
