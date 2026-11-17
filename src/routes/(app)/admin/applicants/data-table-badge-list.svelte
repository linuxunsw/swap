<script lang="ts">
	import { SubcommitteeBadges } from '#lib/components/subcommittee-badges/index.ts';
	import type { SubcommitteeOption } from '#lib/server/controllers/subcommittee.ts';

	let { subcommittees, maxWidth }: { subcommittees: SubcommitteeOption[]; maxWidth: number } =
		$props();
</script>

<SubcommitteeBadges {subcommittees} {maxWidth} />
