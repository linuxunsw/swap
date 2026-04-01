import * as v from 'valibot';

const APPLICATION_TEXTAREA_MAX_LENGTH = 2000;
export const MAX_EXPERIENCE_LENGTH = APPLICATION_TEXTAREA_MAX_LENGTH;
export const MAX_REASON_LENGTH = APPLICATION_TEXTAREA_MAX_LENGTH;

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
			v.maxLength(
				MAX_REASON_LENGTH,
				`Please keep your response under ${MAX_REASON_LENGTH} characters`
			)
		),
		experience: v.pipe(
			v.string(),
			v.trim(),
			v.maxLength(
				MAX_EXPERIENCE_LENGTH,
				`Please keep your response under ${MAX_EXPERIENCE_LENGTH} characters`
			)
		)
	});
}

export type ApplicationSchema = ReturnType<typeof createApplicationSchema>;
