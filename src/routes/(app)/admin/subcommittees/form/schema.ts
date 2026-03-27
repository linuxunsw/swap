import { swapBadgeVariants } from '$lib/constants';
import * as v from 'valibot';

export const subcommitteeSchema = v.object({
	id: v.pipe(v.string(), v.trim(), v.minLength(1, 'Subcommittee ID is required')),
	name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Subcommittee name is required')),
	description: v.optional(v.pipe(v.string(), v.trim())),
	colour: v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(swapBadgeVariants.length - 1))
});
export type SubcommitteeSchema = typeof subcommitteeSchema;

export const subcommitteeIdSchema = v.pick(subcommitteeSchema, ['id']);
