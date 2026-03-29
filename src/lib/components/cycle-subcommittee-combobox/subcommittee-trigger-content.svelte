<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { cn } from '$lib/utils.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import type { ComboboxOption } from './utils';
	import { getSubcommitteeColourClass } from './utils';

	let { selectedSubcommittees }: { selectedSubcommittees: ComboboxOption[] } = $props();
</script>

<div class="flex flex-wrap items-center gap-1.5 pr-2">
	{#if selectedSubcommittees.length > 0}
		{#each selectedSubcommittees.slice(0, 3) as selectedSubcommittee (selectedSubcommittee.id)}
			<Badge
				variant="outline"
				class={cn(
					'rounded-sm border-transparent px-1.5 py-0.5 text-xs',
					getSubcommitteeColourClass(selectedSubcommittee)
				)}
			>
				{selectedSubcommittee.name}
			</Badge>
		{/each}
		{#if selectedSubcommittees.length > 3}
			<Badge variant="outline" class="px-1.5 py-0.5 text-xs">
				+{selectedSubcommittees.length - 3} more
			</Badge>
		{/if}
	{:else}
		<span class="text-muted-foreground">Select subcommittees...</span>
	{/if}
</div>
<ChevronsUpDownIcon class="size-4 shrink-0 text-muted-foreground/80" />
