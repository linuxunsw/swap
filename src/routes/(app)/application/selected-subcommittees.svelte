<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	type Props = {
		names: string[];
	};

	let { names }: Props = $props();
</script>

{#if names.length > 0}
	<Card.Root>
		<Card.Header>
			<Card.Title>Selected subcommittees</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-2">
			{#each names as name}
				<div class="rounded-md border px-3 py-2 text-sm">{name}</div>
			{/each}
		</Card.Content>
	</Card.Root>
{/if}
