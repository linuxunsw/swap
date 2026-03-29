<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils';
	import CheckIcon from '@lucide/svelte/icons/check';
	import SlidersHorizontalIcon from '@lucide/svelte/icons/sliders-horizontal';
	import type { Table } from '@tanstack/table-core';
	import type { Applicant } from './columns';

	let { table }: { table: Table<Applicant> } = $props();

	const toggleableColumns = $derived(
		table
			.getAllColumns()
			.filter(
				(column) =>
					column.getCanHide() && ['preferredEmail', 'discord', 'submittedAt'].includes(column.id)
			)
	);
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="ml-auto hidden h-8 lg:flex">
				<SlidersHorizontalIcon class="size-4" />
				View
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content align="end" class="w-42.5 p-0">
		<Command.Root>
			<Command.List>
				<Command.Group>
					{#each toggleableColumns as column (column.id)}
						<Command.Item
							value={column.id}
							onSelect={() => column.toggleVisibility(!column.getIsVisible())}
						>
							<div
								class={cn(
									'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
									column.getIsVisible()
										? 'bg-primary text-primary-foreground'
										: 'opacity-50 [&_svg]:invisible'
								)}
							>
								<CheckIcon class="size-3.5" />
							</div>
							<span class="capitalize">{column.id === 'preferredEmail' ? 'Email' : column.id}</span>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
