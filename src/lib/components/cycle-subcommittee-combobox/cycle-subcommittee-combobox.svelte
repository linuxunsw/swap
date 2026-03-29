<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import type { SubcommitteeOption } from '$lib/server/controllers/subcommittee';
	import SubcommitteeCommandContent from './subcommittee-command-content.svelte';
	import SubcommitteeTriggerContent from './subcommittee-trigger-content.svelte';
	import type { ComboboxOption } from './utils';

	let {
		id,
		name,
		subcommittees,
		onCreate,
		selectedIds = $bindable([] as string[])
	}: {
		id: string;
		name: string;
		subcommittees: ComboboxOption[];
		onCreate?: (subcommittee: SubcommitteeOption) => void;
		selectedIds?: string[];
	} = $props();

	const isMobile = new IsMobile();
	let open = $state(false);

	const selectedSubcommittees = $derived(
		subcommittees.filter((subcommittee) => selectedIds.includes(subcommittee.id))
	);

	function toggleSelection(optionId: string) {
		selectedIds = selectedIds.includes(optionId)
			? selectedIds.filter((selectedId) => selectedId !== optionId)
			: [...selectedIds, optionId];
	}

	function handleTriggerKeydown(event: KeyboardEvent) {
		if (event.key === 'Backspace' && selectedIds.length > 0 && !open) {
			event.preventDefault();
			selectedIds = selectedIds.slice(0, -1);
		}
	}
</script>

{#if isMobile.current}
	<Drawer.Root bind:open>
		<Drawer.Trigger {id}>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					class="h-auto min-h-9 w-full justify-between py-1.5"
					role="combobox"
					aria-expanded={open}
					onkeydown={handleTriggerKeydown}
				>
					<SubcommitteeTriggerContent {selectedSubcommittees} />
				</Button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content class="p-0">
			<Drawer.Header class="sr-only">
				<Drawer.Title>Select subcommittees</Drawer.Title>
				<Drawer.Description>Search and select one or more subcommittees.</Drawer.Description>
			</Drawer.Header>
			<div class="border-t">
				<SubcommitteeCommandContent
					{subcommittees}
					{selectedIds}
					onToggleSelection={toggleSelection}
					{onCreate}
				/>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{:else}
	<Popover.Root bind:open>
		<Popover.Trigger {id}>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					class="h-auto min-h-9 w-full justify-between py-1.5"
					role="combobox"
					aria-expanded={open}
					onkeydown={handleTriggerKeydown}
				>
					<SubcommitteeTriggerContent {selectedSubcommittees} />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="p-0" align="start">
			<SubcommitteeCommandContent
				{subcommittees}
				{selectedIds}
				onToggleSelection={toggleSelection}
				{onCreate}
			/>
		</Popover.Content>
	</Popover.Root>
{/if}

<select hidden multiple {name} value={selectedIds}>
	{#each subcommittees as sub (sub.id)}
		<option value={sub.id} hidden selected={selectedIds.includes(sub.id)}>{sub.name}</option>
	{/each}
</select>
