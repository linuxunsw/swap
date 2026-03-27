import { swapBadgeVariants } from '$lib/constants';
import type { SubcommitteeOption } from '$lib/server/controllers/subcommittee';

export type ComboboxOption = Pick<SubcommitteeOption, 'id' | 'name' | 'colour' | 'description'>;

type QuickCreateSubcommitteeResponse = { subcommittee: ComboboxOption } | { error: string };

export function getSubcommitteeColourClass(option: ComboboxOption): string {
	const index = Math.abs(option.colour) % swapBadgeVariants.length;
	return swapBadgeVariants[index];
}

export async function quickCreateSubcommittee(
	subcommitteeName: string
): Promise<{ subcommittee?: ComboboxOption; error?: string }> {
	const response = await fetch('/admin/cycles/subcommittees', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({ name: subcommitteeName })
	});

	const payload = (await response
		.json()
		.catch(() => null)) as QuickCreateSubcommitteeResponse | null;
	if (!response.ok || !payload || !('subcommittee' in payload)) {
		return {
			error: payload && 'error' in payload ? payload.error : 'Unable to create subcommittee.'
		};
	}

	return { subcommittee: payload.subcommittee };
}
