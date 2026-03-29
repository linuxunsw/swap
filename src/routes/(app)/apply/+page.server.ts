import { log } from '$lib/log';
import {
	createOrUpdateApplication,
	getApplication,
	submitApplication
} from '$lib/server/controllers/application';
import {
	getApplicantCycleAccess,
	getCurrentApplicationCycle
} from '$lib/server/controllers/application-cycle';
import {
	getApplicationSubcommitteeIds,
	getSubcommitteeOptionsByCycle
} from '$lib/server/controllers/subcommittee';
import { error, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { createApplicationSchema } from './schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, '/login');
	}

	const db = event.locals.db;
	const access = await getApplicantCycleAccess(db, event.locals.user.id);
	if (!access.effectiveCycleForUser) {
		redirect(302, '/closed');
	}

	if (!access.isWithinSubmissionWindow) {
		if (access.hasApplicationInLatestCycle) {
			redirect(302, '/');
		}

		redirect(302, '/closed');
	}

	const cycle = access.effectiveCycleForUser;
	const subcommitteeOptions = await getSubcommitteeOptionsByCycle(db, cycle.id);
	const applicationSchema = createApplicationSchema(subcommitteeOptions.map((row) => row.id));

	const existing = await getApplication(db, event.locals.user.id, cycle);

	if (existing && existing.status !== 'draft' && existing.status !== 'submitted') {
		redirect(302, '/');
	}

	const form = await superValidate(valibot(applicationSchema));

	if (existing) {
		form.data.fullName = existing.fullName;
		form.data.discord = existing.discord;
		form.data.preferredEmail = existing.preferredEmail ?? '';
		form.data.reason = existing.reason;
		form.data.experience = existing.experience;

		form.data.subcommittees = await getApplicationSubcommitteeIds(db, existing.id);
	}

	log('info', 'apply', 'load_form', {
		userId: event.locals.user.id,
		existingApplication: !!existing,
		formData: form.data
	});

	const isEdit = !!existing;
	const isDraft = existing?.status === 'draft';
	return {
		form,
		subcommitteeOptions,
		cycleName: cycle.name,
		isEdit,
		routeTitle: isEdit
			? isDraft
				? 'Edit Application (Draft)'
				: 'Edit Application'
			: 'New Application'
	};
};

export const actions: Actions = {
	save: async (event) => {
		if (!event.locals.user) {
			error(401, { message: 'Not authenticated' });
		}

		const db = event.locals.db;
		const cycle = await getCurrentApplicationCycle(db);
		if (!cycle) {
			error(400, { message: 'Applications are not open for submission' });
		}

		const subcommitteeOptions = await getSubcommitteeOptionsByCycle(db, cycle.id);
		const applicationSchema = createApplicationSchema(subcommitteeOptions.map((row) => row.id));
		const formResult = await superValidate(event, valibot(applicationSchema));
		if (!formResult.valid) {
			return fail(400, { form: formResult });
		}

		try {
			const saved = await createOrUpdateApplication(db, event.locals.user.id, {
				fullName: formResult.data.fullName,
				discord: formResult.data.discord,
				preferredEmail: formResult.data.preferredEmail ?? '',
				subcommittees: formResult.data.subcommittees,
				reason: formResult.data.reason,
				experience: formResult.data.experience
			});

			log('info', 'apply', 'save_draft', {
				userZid: event.locals.user.zid,
				applicationId: saved.id
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Unable to save draft';
			return message(formResult, msg, { status: 400 });
		}

		return message(formResult, 'Draft saved.');
	},

	submit: async (event) => {
		if (!event.locals.user) {
			error(401, { message: 'Not authenticated' });
		}

		const db = event.locals.db;
		const cycle = await getCurrentApplicationCycle(db);
		if (!cycle) {
			error(400, { message: 'Applications are not open for submission' });
		}

		const subcommitteeOptions = await getSubcommitteeOptionsByCycle(db, cycle.id);
		const applicationSchema = createApplicationSchema(subcommitteeOptions.map((row) => row.id));
		const formResult = await superValidate(event, valibot(applicationSchema));
		if (!formResult.valid) {
			return fail(400, { form: formResult });
		}

		try {
			await createOrUpdateApplication(db, event.locals.user.id, {
				fullName: formResult.data.fullName,
				discord: formResult.data.discord,
				preferredEmail: formResult.data.preferredEmail ?? '',
				subcommittees: formResult.data.subcommittees,
				reason: formResult.data.reason,
				experience: formResult.data.experience
			});

			const submitted = await submitApplication(db, event.locals.user.id);

			log('info', 'apply', 'submit', {
				userZid: event.locals.user.zid,
				applicationId: submitted.id
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Unable to submit application';
			return message(formResult, msg, { status: 400 });
		}

		redirect(303, '/', 'Application submitted successfully!', event);
	}
};
