<script lang="ts">
	import EmptyApplication from '$lib/components/empty-application.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { columns } from './columns';
	import DataTable from './data-table.svelte';

	let { data } = $props();

	const subcommitteeFilterOptions = $derived.by(() => {
		const byId = new SvelteMap<string, { id: string; name: string }>();
		for (const applicant of data.applicants) {
			for (const subcommittee of applicant.subcommittees) {
				if (!byId.has(subcommittee.id)) {
					byId.set(subcommittee.id, {
						id: subcommittee.id,
						name: subcommittee.name
					});
				}
			}
		}
		return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
	});
</script>

<section class="space-y-4">
	<header class="space-y-1">
		<h1 class="text-2xl font-semibold">Applicants</h1>
		{#if data.cycle}
			<p class="text-sm text-muted-foreground">Current cycle: {data.cycle.name}</p>
		{:else}
			<p class="text-sm text-muted-foreground">No active cycle found.</p>
		{/if}
	</header>

	{#if data.applicants.length === 0}
		<EmptyApplication />
	{:else}
		<DataTable
			{columns}
			data={data.applicants}
			{subcommitteeFilterOptions}
			getRowHref={(row) => `/admin/applicants/${row.id}`}
		/>
	{/if}
</section>
