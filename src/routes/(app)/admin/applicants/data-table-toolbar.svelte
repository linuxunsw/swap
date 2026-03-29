<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { APPLICATION_STATUSES } from '$lib/constants/application-status';
	import { STATUS_DISPLAY_ICON } from '$lib/constants/status-icon';
	import XIcon from '@lucide/svelte/icons/x';
	import type { Table } from '@tanstack/table-core';
	import type { Applicant } from './columns';
	import DataTableFacetedFilter from './data-table-faceted-filter.svelte';
	import DataTableViewOptions from './data-table-view-options.svelte';

	let {
		table,
		subcommitteeFilterOptions
	}: {
		table: Table<Applicant>;
		subcommitteeFilterOptions: { id: string; name: string }[];
	} = $props();

	const isFiltered = $derived(
		table.getState().columnFilters.length > 0 || !!table.getState().globalFilter
	);

	const statusOptions = APPLICATION_STATUSES.map((status) => ({
		label: STATUS_DISPLAY_ICON[status].label,
		value: status,
		icon: STATUS_DISPLAY_ICON[status].icon
	}));
</script>

<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
	<div class="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
		<Input
			placeholder="Search applicants..."
			value={String(table.getState().globalFilter ?? '')}
			oninput={(event) => table.setGlobalFilter(event.currentTarget.value)}
			class="h-8 w-full sm:w-70 lg:w-85"
		/>
		<div class="flex flex-wrap items-center gap-2">
			<DataTableFacetedFilter
				column={table.getColumn('status')!}
				title="Status"
				options={statusOptions}
			/>
			<DataTableFacetedFilter
				column={table.getColumn('subcommittees')!}
				title="Subcommittee"
				options={subcommitteeFilterOptions.map((subcommittee) => ({
					label: subcommittee.name,
					value: subcommittee.id
				}))}
			/>
			{#if isFiltered}
				<Button
					variant="ghost"
					size="sm"
					class="h-8 px-2 lg:px-3"
					onclick={() => {
						table.resetColumnFilters();
						table.setGlobalFilter('');
					}}
				>
					Reset
					<XIcon class="size-4" />
				</Button>
			{/if}
		</div>
	</div>
	<DataTableViewOptions {table} />
</div>
