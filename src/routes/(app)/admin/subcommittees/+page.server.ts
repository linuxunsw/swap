import {
	createSubcommittee,
	deleteSubcommittee,
	getAllSubcommitteeOptions,
	getSubcommitteeById,
	updateSubcommittee
} from '$lib/server/controllers/subcommittee';
import { getDb, type SwapDb } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import {
	fail,
	message,
	setError,
	superValidate,
	type Infer,
	type SuperValidated
} from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { subcommitteeIdSchema, subcommitteeSchema } from './form/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	if (event.locals.user.role !== 'admin') {
		return redirect(302, '/');
	}

	const db = getDb();
	const subcommittees = await getAllSubcommitteeOptions(db);

	const form = await superValidate(valibot(subcommitteeSchema));

	return {
		subcommittees: subcommittees,
		role: event.locals.user.role,
		form: form
	};
};

async function checkIdExists(
	db: SwapDb,
	form: SuperValidated<Infer<typeof subcommitteeIdSchema>>
): Promise<boolean> {
	// simulate delay
	await new Promise((resolve) => setTimeout(resolve, 2000));
	return Boolean(await getSubcommitteeById(db, form.data.id));
}

export const actions: Actions = {
	create: async (event) => {
		if (!event.locals.user) {
			return error(401, 'Not Authenticated');
		}

		if (event.locals.user.role !== 'admin') {
			return error(401, 'Unauthorised');
		}

		const db = getDb();
		const form = await superValidate(event, valibot(subcommitteeSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (await checkIdExists(db, form)) {
			setError(form, 'id', 'Subcommittee ID is already used.');
			return fail(400, { form });
		}

		try {
			await createSubcommittee(db, form.data);
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Unable to create subcommittee';
			return message(form, msg, { status: 400 });
		}

		return message(form, 'Subcommittee successfully created');
	},

	update: async (event) => {
		if (!event.locals.user) {
			return error(401, 'Not Authenticated');
		}

		if (event.locals.user.role !== 'admin') {
			return error(401, 'Unauthorised');
		}

		const db = getDb();
		const form = await superValidate(event, valibot(subcommitteeSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!(await checkIdExists(db, form))) {
			setError(form, 'id', 'Subcommittee not found.');
			return fail(400, { form });
		}

		try {
			await updateSubcommittee(db, form.data);
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Unable to update subcommittee';
			return message(form, msg, { status: 400 });
		}

		return message(form, 'Subcommittee successfully updated');
	},

	delete: async (event) => {
		if (!event.locals.user) {
			return error(401, 'Not Authenticated');
		}

		if (event.locals.user.role !== 'admin') {
			return error(401, 'Unauthorised');
		}

		const db = getDb();
		const form = await superValidate(event, valibot(subcommitteeIdSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!(await checkIdExists(db, form))) {
			setError(form, 'id', 'Subcommittee not found.');
			return fail(400, { form });
		}

		try {
			await deleteSubcommittee(db, form.data.id);
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Unable to delete subcommittee';
			return message(form, msg, { status: 400 });
		}

		return message(form, 'Subcommittee successfully deleted');
	},

	check: async (event) => {
		if (!event.locals.user) {
			return error(401, 'Not Authenticated');
		}

		if (event.locals.user.role !== 'admin') {
			return error(401, 'Unauthorised');
		}

		const db = getDb();
		const form = await superValidate(event, valibot(subcommitteeIdSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (await checkIdExists(db, form)) {
			setError(form, 'id', 'Subcommittee ID is already used.');
			return fail(400, { form });
		}

		return { form };
	}
};
