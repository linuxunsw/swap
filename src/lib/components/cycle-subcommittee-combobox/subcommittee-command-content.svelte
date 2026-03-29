<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import { cn } from '$lib/utils.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { toast } from 'svelte-sonner';
	import type { ComboboxOption } from './utils';
	import { getSubcommitteeColourClass, quickCreateSubcommittee } from './utils';

	let {
		subcommittees,
		selectedIds,
		onToggleSelection,
		onCreate
	}: {
		subcommittees: ComboboxOption[];
		selectedIds: string[];
		onToggleSelection: (id: string) => void;
		onCreate?: (subcommittee: ComboboxOption) => void;
	} = $props();

	let search = $state('');
	let creating = $state(false);

	const normalizedSearch = $derived(search.trim());
	const hasExactNameMatch = $derived(
		normalizedSearch.length > 0 &&
			subcommittees.some(
				(subcommittee) => subcommittee.name.toLowerCase() === normalizedSearch.toLowerCase()
			)
	);
	const canCreateSubcommittee = $derived(
		normalizedSearch.length > 0 && !hasExactNameMatch && !creating
	);

	async function createSubcommitteeFromSearch() {
		const subcommitteeName = normalizedSearch;
		if (!subcommitteeName || creating) {
			return;
		}

		creating = true;
		try {
			const { subcommittee, error } = await quickCreateSubcommittee(subcommitteeName);
			if (!subcommittee) {
				toast.error(error ?? 'Unable to create subcommittee.');
				return;
			}

			onCreate?.(subcommittee);
			if (!selectedIds.includes(subcommittee.id)) {
				onToggleSelection(subcommittee.id);
			}
			search = '';
			toast.success(`Created ${subcommittee.name}`);
		} catch {
			toast.error('Unable to create subcommittee.');
		} finally {
			creating = false;
		}
	}
</script>

<Command.Root>
	<Command.Input bind:value={search} placeholder="Search subcommittee..." />
	<Command.List>
		<Command.Empty>No subcommittees found.</Command.Empty>
		<Command.Group value="subcommittees">
			{#each subcommittees as subcom (subcom.id)}
				<Command.Item
					value={subcom.id}
					class="data-selected:bg-muted/60 [&_.cn-command-item-indicator]:hidden"
					onSelect={() => {
						onToggleSelection(subcom.id);
					}}
				>
					<span class={cn('size-2 rounded-full', getSubcommitteeColourClass(subcom))}></span>
					<span class="truncate">{subcom.name}</span>
					<CheckIcon
						class={cn(
							'ml-auto size-4 shrink-0',
							!selectedIds.includes(subcom.id) && 'text-transparent'
						)}
					/>
				</Command.Item>
			{/each}
		</Command.Group>
		{#if canCreateSubcommittee}
			<Command.Separator />
			<Command.Group value="create-subcommittee">
				<Command.Item
					value={`create-${normalizedSearch.toLowerCase()}`}
					onSelect={createSubcommitteeFromSearch}
					disabled={creating}
				>
					<PlusIcon class="text-muted-foreground" />
					Create "{normalizedSearch}"
				</Command.Item>
			</Command.Group>
		{/if}
	</Command.List>
</Command.Root>
