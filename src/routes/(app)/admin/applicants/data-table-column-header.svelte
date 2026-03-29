<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
	import type { Column } from '@tanstack/table-core';
	import type { Applicant } from './columns';

	let { column, title }: { column: Column<Applicant>; title: string } = $props();

	const sortDirection = $derived(column.getIsSorted());
</script>

<Button
	variant="ghost"
	size="sm"
	class="-ml-2 h-8"
	onclick={() => column.toggleSorting(sortDirection === 'asc')}
>
	<span>{title}</span>
	{#if sortDirection === 'asc'}
		<ArrowUpIcon class="size-4" />
	{:else if sortDirection === 'desc'}
		<ArrowDownIcon class="size-4" />
	{:else}
		<ArrowUpDownIcon class="size-4" />
	{/if}
</Button>
