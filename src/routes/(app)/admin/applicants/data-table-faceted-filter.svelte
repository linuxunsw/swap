<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils';
	import CheckIcon from '@lucide/svelte/icons/check';
	import PlusCircleIcon from '@lucide/svelte/icons/plus-circle';
	import type { Column } from '@tanstack/table-core';
	import type { Component } from 'svelte';
	import type { Applicant } from './columns';

	type Option = {
		label: string;
		value: string;
		icon?: Component;
	};

	let {
		column,
		title,
		options
	}: {
		column: Column<Applicant>;
		title: string;
		options: Option[];
	} = $props();

	const selectedValues = $derived((column.getFilterValue() as string[]) ?? []);
	const selectedOptions = $derived(
		options.filter((option) => selectedValues.includes(option.value))
	);

	const toggle = (value: string) => {
		const next = [...selectedValues];
		const existingIndex = next.indexOf(value);
		if (existingIndex >= 0) {
			next.splice(existingIndex, 1);
		} else {
			next.push(value);
		}
		column.setFilterValue(next.length > 0 ? next : undefined);
	};
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="h-8 border-dashed">
				<PlusCircleIcon class="size-4" />
				{title}
				{#if selectedOptions.length > 0}
					<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
						{selectedOptions.length}
					</Badge>
					<div class="hidden gap-1 lg:flex">
						{#if selectedOptions.length > 2}
							<Badge variant="secondary" class="rounded-sm px-1 font-normal">
								{selectedOptions.length} selected
							</Badge>
						{:else}
							{#each selectedOptions as option (option.value)}
								<Badge variant="secondary" class="rounded-sm px-1 font-normal">
									{#if option.icon}
										<option.icon class="mr-1 size-3" />
									{/if}
									{option.label}
								</Badge>
							{/each}
						{/if}
					</div>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-55 p-0" align="start">
		<Command.Root>
			<Command.Input placeholder={`Filter ${title.toLowerCase()}...`} />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					{#each options as option (option.value)}
						<Command.Item value={option.label} onSelect={() => toggle(option.value)}>
							<div
								class={cn(
									'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
									selectedValues.includes(option.value)
										? 'bg-primary text-primary-foreground'
										: 'opacity-50 [&_svg]:invisible'
								)}
							>
								<CheckIcon class="size-3.5" />
							</div>
							{#if option.icon}
								<option.icon class="mr-2 size-4 text-muted-foreground" />
							{/if}
							<span>{option.label}</span>
						</Command.Item>
					{/each}
				</Command.Group>
				{#if selectedValues.length > 0}
					<Command.Separator />
					<Command.Group>
						<Command.Item onSelect={() => column.setFilterValue(undefined)}>
							Clear filters
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
