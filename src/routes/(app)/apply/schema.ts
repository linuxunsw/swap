import * as v from 'valibot';

export function createApplicationSchema(allowedSubcommitteeIds: string[]) {
	const allowedIds = new Set(allowedSubcommitteeIds);

	return v.object({
		fullName: v.pipe(
			v.string(),
			v.trim(),
			v.minLength(1, 'Full name is required'),
			v.maxLength(200, 'Full name is too long')
		),
		discord: v.pipe(
			v.string(),
			v.trim(),
			v.minLength(1, 'Discord username is required'),
			v.maxLength(100, 'Discord username is too long')
		),
		preferredEmail: v.pipe(
			v.optional(v.pipe(v.string(), v.trim()), ''),
			v.transform((val) => (val === '' ? undefined : val)),
			v.optional(v.pipe(v.string(), v.email('Please enter a valid email')))
		),
		subcommittees: v.pipe(
			v.array(v.pipe(v.string(), v.trim(), v.minLength(1))),
			v.minLength(1, 'Select at least one subcommittee'),
			v.check(
				(values) => values.every((value) => allowedIds.has(value)),
				'One or more selected subcommittees are invalid'
			)
		),
		reason: v.pipe(
			v.string(),
			v.trim(),
			v.minLength(1, 'Please tell us why you want to join'),
			v.maxLength(2000, 'Please keep your response under 2000 characters')
		),
		experience: v.pipe(
			v.string(),
			v.trim(),
			v.maxLength(2000, 'Please keep your response under 2000 characters')
		)
	});
}

export type ApplicationSchema = ReturnType<typeof createApplicationSchema>;
