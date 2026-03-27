import { log } from '$lib/log';
import {
	deleteApplicationCycle,
	getApplicationCycleById,
	updateCycleWithSubcommittees
} from '$lib/server/controllers/application-cycle';
import { getAllSubcommitteeOptions } from '$lib/server/controllers/subcommittee';
import { getDb } from '$lib/server/db';
import { parseDate } from '@internationalized/date';
import { error, fail, type Actions } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import * as v from 'valibot';
import { createCycleSchema } from '../../form/schema';
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
		error(400, 'Invalid cycle ID');
	}

	const cycle = await getApplicationCycleById(db, event.params.slug);
	if (!cycle) {
		error(404, 'Cycle not found');
	}
	const subcommitteeOptions = await getAllSubcommitteeOptions(db);
	const cycleSchema = createCycleSchema(subcommitteeOptions.map((row) => row.id));
	const form = await superValidate(valibot(cycleSchema));

	if (cycle) {
		form.data.name = cycle.name;
		form.data.opensAt = cycle.opensAt.toISOString().slice(0, 10);
		form.data.closesAt = cycle.closesAt.toISOString().slice(0, 10);
		form.data.subcommitteeIds = cycle.subcommittees.map((row) => row.subcommittee.id);
	}

	return {
		role: event.locals.user.role,
		slug: event.params.slug,
		routeTitle: `Edit Cycle - ${cycle?.name ?? 'Unknown Cycle'}`,
		cycle,
		subcommitteeOptions,
		form
	};
};

export const actions: Actions = {
	editCycle: async (event) => {
		if (!event.locals.user) {
			error(401, 'Not authenticated');
		}

		if (event.locals.user?.role !== 'admin') {
			error(403, 'Not authorised');
		}

		if (!event.params.slug) {
			error(400, 'Missing cycle ID');
		}

		const db = getDb();
		const subcommitteeOptions = await getAllSubcommitteeOptions(db);
		const cycleSchema = createCycleSchema(subcommitteeOptions.map((row) => row.id));

		const form = await superValidate(event, valibot(cycleSchema));
		if (!form.valid) {
			return { form };
		}

		try {
			await updateCycleWithSubcommittees(db, event.params.slug, {
				...form.data,
				opensAt: parseDate(form.data.opensAt).toDate('Australia/Sydney'),
				closesAt: parseDate(form.data.closesAt).toDate('Australia/Sydney')
			});
			log('info', 'admin', 'edit_cycle', {
				zid: event.locals.user.zid,
				cycleData: form.data
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Unable to edit cycle';
			return message(form, msg, { status: 400 });
		}

		redirect(303, '/admin/cycles', 'Cycle successfully edited', event);
	},

	deleteCycle: async (event) => {
		if (!event.locals.user) {
			error(401, 'Not authenticated');
		}

		if (event.locals.user?.role !== 'admin') {
			error(403, 'Not authorised');
		}

		if (!event.params.slug) {
			error(400, 'Missing cycle ID');
		}

		const db = getDb();
		try {
			await deleteApplicationCycle(db, event.params.slug);

			log('info', 'admin', 'delete_cycle', {
				zid: event.locals.user.zid,
				cycleId: event.params.slug
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Unable to delete cycle';
			return fail(400, msg);
		}

		redirect(303, '/admin/cycles', 'Cycle successfully deleted', event);
	}
};
