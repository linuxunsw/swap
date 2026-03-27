import * as v from 'valibot';

export const createCycleSchema = (allowedSubcommitteeIds: string[]) => {
	const now = new Date();
	const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
		now.getDate()
	).padStart(2, '0')}`;

	return v.pipe(
		v.object({
			name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Cycle name is required')),
			opensAt: v.pipe(
				v.string('Opening date is required'),
				v.trim(),
				v.minLength(1, 'Opening date is required'),
				v.isoDate('Opening date must be a valid date')
			),
			closesAt: v.pipe(
				v.string('Closing date is required'),
				v.trim(),
				v.minLength(1, 'Closing date is required'),
				v.isoDate('Closing date must be a valid date')
			),
			subcommitteeIds: v.array(
				v.pipe(v.picklist(allowedSubcommitteeIds)),
				'One or more selected subcommittees are invalid'
			)
		}),
		v.check((input) => input.opensAt >= todayLocal, 'Opening date cannot be in the past'),
		v.check((input) => input.closesAt > input.opensAt, 'Closing date must be after opening date')
	);
};
export type CycleSchema = ReturnType<typeof createCycleSchema>;
