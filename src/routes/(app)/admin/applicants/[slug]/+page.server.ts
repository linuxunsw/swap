import { getApplicationById } from '$lib/server/controllers/application';
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

	const db = event.locals.db;

	const validator = v.pipe(v.string(), v.uuid());
	const result = v.safeParse(validator, event.params.slug);
	if (!result.success) {
		error(400, 'Invalid application ID');
	}

	const application = await getApplicationById(db, event.params.slug);
	if (!application) {
		error(404, 'Application not found');
	}

	const subcommitteeNames = application.subcommittees.map((row) => row.subcommittee.name);
	const yesVotes = application.votes.filter((vote) => vote.value === 1).length;
	const noVotes = application.votes.filter((vote) => vote.value === 0).length;

	return {
		role: event.locals.user.role,
		routeTitle: 'Applicant Info',
		slug: event.params.slug,
		application,
		subcommitteeNames,
		voteSummary: {
			yes: yesVotes,
			no: noVotes,
			total: application.votes.length
		}
	};
};
