import { log } from '$lib/log';
import { createCycleWithSubcommittees } from '$lib/server/controllers/application-cycle';
import { getAllSubcommitteeOptions } from '$lib/server/controllers/subcommittee';
import { getDb } from '$lib/server/db';
import { parseDate } from '@internationalized/date';
import { error, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { createCycleSchema } from '../form/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	if (event.locals.user.role !== 'admin') {
		return redirect(302, '/');
	}

	const db = getDb();
	const subcommitteeOptions = await getAllSubcommitteeOptions(db);
	const cycleSchema = createCycleSchema(subcommitteeOptions.map((row) => row.id));
	const form = await superValidate(valibot(cycleSchema));

	return {
		role: event.locals.user.role,
		routeTitle: 'New Cycle',
		subcommitteeOptions,
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			error(401, 'Not authenticated');
		}

		if (event.locals.user?.role !== 'admin') {
			error(403, 'Not authorised');
		}

		const db = getDb();
		const subcommitteeOptions = await getAllSubcommitteeOptions(db);
		const cycleSchema = createCycleSchema(subcommitteeOptions.map((row) => row.id));

		const form = await superValidate(event, valibot(cycleSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await createCycleWithSubcommittees(db, {
				...form.data,
				opensAt: parseDate(form.data.opensAt).toDate('Australia/Sydney'),
				closesAt: parseDate(form.data.closesAt).toDate('Australia/Sydney')
			});
			log('info', 'admin', 'create_cycle', {
				zid: event.locals.user.zid,
				cycleData: form.data
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Unable to create cycle';
			log('error', 'admin', 'create_cycle_failed', {
				zid: event.locals.user.zid,
				cycleData: form.data,
				error: msg
			});
			return message(form, msg, { status: 400 });
		}

		redirect(303, '/admin/cycles', 'Cycle successfully created', event);
	}
};
