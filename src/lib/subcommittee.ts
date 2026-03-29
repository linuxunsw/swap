export function slugifySubcommitteeName(name: string): string {
	return name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function buildUniqueSubcommitteeId(name: string, existingIds: string[]): string {
	const baseId = slugifySubcommitteeName(name);
	const idPrefix = baseId || 'new-subcommittee';
	let id = idPrefix;
	let suffix = 1;

	const idSet = new Set(existingIds);
	while (idSet.has(id)) {
		suffix += 1;
		id = `${idPrefix}-${suffix}`;
	}

	return id;
}

export function hasSubcommitteeNameMatch(name: string, existingNames: string[]): boolean {
	const target = name.trim().toLowerCase();
	if (!target) {
		return false;
	}

	return existingNames.some((existingName) => existingName.trim().toLowerCase() === target);
}
