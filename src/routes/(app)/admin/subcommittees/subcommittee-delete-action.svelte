<script lang="ts">
	import { ResponsiveAlertDialog } from '$lib/components/responsive-alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { Trash2Icon } from '@lucide/svelte';

	let {
		formId,
		disabled = false,
		deleteSubmitterId
	}: {
		formId: string;
		disabled?: boolean;
		deleteSubmitterId: string;
	} = $props();

	let deleteAlertOpen = $state(false);
</script>

<ResponsiveAlertDialog
	bind:open={deleteAlertOpen}
	title="Delete Subcommittee"
	description="This action cannot be undone. Are you sure you want to delete this subcommittee?"
	actionLabel="Delete"
	actionVariant="destructive"
	onAction={() => {
		(document.getElementById(deleteSubmitterId) as HTMLButtonElement | null)?.click();
		deleteAlertOpen = false;
	}}
/>

<button
	id={deleteSubmitterId}
	type="submit"
	form={formId}
	formaction="?/delete"
	class="hidden"
	tabindex={-1}
	aria-hidden="true"
></button>

<Button
	type="button"
	variant="destructive"
	{disabled}
	onclick={() => {
		deleteAlertOpen = true;
	}}
>
	{#if disabled}
		<Spinner />
	{/if}
	<Trash2Icon />
	Delete
	<span class="sr-only">Delete Subcommittee</span>
</Button>
