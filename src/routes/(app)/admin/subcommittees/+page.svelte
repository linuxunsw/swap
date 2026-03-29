<script lang="ts">
	const { data } = $props();

	import * as Item from '$lib/components/ui/item/index.js';
	import { swapBadgeVariants } from '$lib/constants';
	import { PlusIcon, SquarePenIcon } from '@lucide/svelte';
	import SubcommitteeDialog from './subcommittee-dialog.svelte';
</script>

<div class="mb-4 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Subcommittees</h1>
	<SubcommitteeDialog form={data.form} action="create">
		<PlusIcon /> Create
	</SubcommitteeDialog>
</div>

<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
	{#if data.subcommittees.length === 0}
		<div class="flex h-12 items-center rounded-md border px-4">No subcommittees</div>
	{/if}
	{#each data.subcommittees as subcommittee (subcommittee.id)}
		<Item.Root size="xs" variant="outline">
			<Item.Media variant="default">
				<span
					class={`${swapBadgeVariants[subcommittee.colour % swapBadgeVariants.length]} mr-2 h-5 min-w-5`}
				></span>
			</Item.Media>
			<Item.Content>
				<Item.Title>{subcommittee.name}</Item.Title>
				<Item.Description>
					{subcommittee.description ? subcommittee.description : 'No description provided.'}
				</Item.Description>
			</Item.Content>
			<Item.Actions>
				<SubcommitteeDialog
					form={data.form}
					action="update"
					subcommitteeOption={subcommittee}
					triggerVariant="ghost"
					triggerSize="icon-sm"
				>
					<SquarePenIcon />
				</SubcommitteeDialog>
			</Item.Actions>
		</Item.Root>
	{/each}
</div>
