<script lang="ts">
	import { SubcommitteeBadges } from '$lib/components/subcommittee-badges';
	import type { SubcommitteeOption } from '$lib/server/controllers/subcommittee';

	let { subcommittees, maxWidth }: { subcommittees: SubcommitteeOption[]; maxWidth: number } =
		$props();
</script>

<SubcommitteeBadges {subcommittees} {maxWidth} />
