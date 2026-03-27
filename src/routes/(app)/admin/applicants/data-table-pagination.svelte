<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import ChevronsLeftIcon from '@lucide/svelte/icons/chevrons-left';
	import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right';
	import type { Table } from '@tanstack/table-core';
	import type { Applicant } from './columns';

	let { table }: { table: Table<Applicant> } = $props();
	const pageSize = $derived(table.getState().pagination.pageSize);
</script>

<div class="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
	<div class="text-sm text-muted-foreground">
		{table.getFilteredRowModel().rows.length} result(s)
	</div>
	<div class="flex flex-wrap items-center gap-2 sm:gap-4">
		<div class="flex items-center gap-2">
			<p class="text-sm font-medium">Rows</p>
			<Popover.Root>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="sm" class="h-8 w-14">{pageSize}</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-20 p-1" align="start">
					<div class="grid gap-1">
						{#each [10, 20, 50] as size (size)}
							<Button
								variant={size === pageSize ? 'secondary' : 'ghost'}
								size="sm"
								class="h-7 justify-start"
								onclick={() => table.setPageSize(size)}
							>
								{size}
							</Button>
						{/each}
					</div>
				</Popover.Content>
			</Popover.Root>
		</div>
		<div class="flex w-25 items-center justify-center text-sm font-medium">
			Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
		</div>
		<div class="flex items-center gap-1">
			<Button
				variant="outline"
				size="icon"
				class="hidden size-8 lg:flex"
				onclick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">First page</span>
				<ChevronsLeftIcon class="size-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="size-8"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">Previous page</span>
				<ChevronLeftIcon class="size-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="size-8"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Next page</span>
				<ChevronRightIcon class="size-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="hidden size-8 lg:flex"
				onclick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Last page</span>
				<ChevronsRightIcon class="size-4" />
			</Button>
		</div>
	</div>
</div>
