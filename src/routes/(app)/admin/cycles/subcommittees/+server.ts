import { swapBadgeVariants } from '$lib/constants';
import {
	createSubcommittee,
	getAllSubcommitteeOptions
} from '$lib/server/controllers/subcommittee';
import { buildUniqueSubcommitteeId, hasSubcommitteeNameMatch } from '$lib/subcommittee';
import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';

const quickCreateSubcommitteeSchema = v.object({
	name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Subcommittee name is required'))
});

export const POST: RequestHandler = async (event) => {
	if (!event.locals.user) {
		error(401, 'Not authenticated');
	}

	if (event.locals.user.role !== 'admin') {
		error(403, 'Not authorised');
	}

	const body = await event.request.json().catch(() => null);
	const result = v.safeParse(quickCreateSubcommitteeSchema, body);
	if (!result.success) {
		return json({ error: 'Subcommittee name is required.' }, { status: 400 });
	}

	const db = event.locals.db;
	const existingOptions = await getAllSubcommitteeOptions(db);
	const existingNames = existingOptions.map((option) => option.name);
	if (hasSubcommitteeNameMatch(result.output.name, existingNames)) {
		return json({ error: 'A subcommittee with this name already exists.' }, { status: 409 });
	}

	try {
		const newSubcommittee = await createSubcommittee(db, {
			id: buildUniqueSubcommitteeId(
				result.output.name,
				existingOptions.map((option) => option.id)
			),
			name: result.output.name,
			description: '',
			colour: existingOptions.length % swapBadgeVariants.length
		});

		return json({ subcommittee: newSubcommittee }, { status: 201 });
	} catch {
		return json({ error: 'Unable to create subcommittee. Please try again.' }, { status: 400 });
	}
};
