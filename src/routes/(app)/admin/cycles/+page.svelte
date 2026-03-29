<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { CalendarSearchIcon, PlusIcon } from '@lucide/svelte/icons';
	import CycleList from './cycle-list.svelte';
	let { data } = $props();
</script>

{#if !data.cycles}
	<Empty.Root>
		<Empty.Header>
			<Empty.Media variant="icon">
				<CalendarSearchIcon />
			</Empty.Media>
			<Empty.Title>No Cycles Found</Empty.Title>
			<Empty.Description>There are no application cycles set up.</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<Button variant="outline" href="/admin/cycles/new">
				<PlusIcon />
				Create Cycle
			</Button>
		</Empty.Content>
	</Empty.Root>
{:else}
	<div class="mb-2 flex items-center justify-between gap-2">
		<h1 class="text-2xl font-bold">Application Cycles</h1>
		<Button variant="secondary" href="/admin/cycles/new">
			<PlusIcon />
			Create
		</Button>
	</div>
	<CycleList cycles={data.cycles} />
{/if}
