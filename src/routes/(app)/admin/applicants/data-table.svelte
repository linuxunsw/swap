<script lang="ts">
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type SortingState,
		type VisibilityState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import type { Applicant } from './columns';
	import DataTablePagination from './data-table-pagination.svelte';
	import DataTableToolbar from './data-table-toolbar.svelte';

	type DataTableProps = {
		columns: ColumnDef<Applicant>[];
		data: Applicant[];
		getRowHref?: (row: Applicant) => string;
		subcommitteeFilterOptions?: { id: string; name: string }[];
	};

	let { data, columns, getRowHref, subcommitteeFilterOptions = [] }: DataTableProps = $props();

	const isMobile = new IsMobile();
	let lastMobileState = $state<boolean | null>(null);

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([{ id: 'submittedAt', desc: true }]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let globalFilter = $state('');

	// svelte-ignore state_referenced_locally
	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get globalFilter() {
				return globalFilter;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onGlobalFilterChange: (updater) => {
			if (typeof updater === 'function') {
				globalFilter = updater(globalFilter) as string;
			} else {
				globalFilter = String(updater ?? '');
			}
		},
		globalFilterFn: (row, _columnId, filterValue) => {
			const query = String(filterValue ?? '')
				.trim()
				.toLowerCase();
			if (!query) return true;

			const applicant = row.original;
			const values = [applicant.name, applicant.preferredEmail, applicant.discord]
				.filter(Boolean)
				.map((value) => value.toLowerCase());

			return values.some((value) => value.includes(query));
		}
	});

	$effect(() => {
		const currentlyMobile = isMobile.current;
		if (lastMobileState === currentlyMobile) {
			return;
		}

		lastMobileState = currentlyMobile;
		if (currentlyMobile) {
			columnVisibility = {
				...columnVisibility,
				preferredEmail: false,
				discord: false,
				submittedAt: false
			};
		}
	});
</script>

<div class="space-y-4">
	<DataTableToolbar {table} {subcommitteeFilterOptions} />

	<div class="border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#if table.getRowModel().rows.length > 0}
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row
							class={getRowHref
								? 'cursor-pointer hover:bg-muted/40 data-[state=selected]:bg-muted/50'
								: ''}
							onclick={() => {
								if (getRowHref) {
									window.location.href = getRowHref(row.original);
								}
							}}
						>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">
							No matching applicants.
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<DataTablePagination {table} />
</div>
