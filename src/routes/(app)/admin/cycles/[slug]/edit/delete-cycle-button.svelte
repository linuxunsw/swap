<script lang="ts">
	import { enhance } from '$app/forms';
	import ResponsiveAlertDialog from '$lib/components/responsive-alert-dialog/responsive-alert-dialog.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Trash2Icon } from '@lucide/svelte';

	let alertOpen = $state(false);
	const id = $props.id();
</script>

<ResponsiveAlertDialog
	bind:open={alertOpen}
	title="Delete Cycle"
	description="This action cannot be undone. Are you sure?"
	actionLabel="Delete"
	actionVariant="destructive"
	onAction={() => {
		document.querySelector(`form#${id}`)?.requestSubmit();
	}}
/>

<form {id} method="POST" action="?/deleteCycle" use:enhance>
	<Button variant="destructive" onclick={() => (alertOpen = true)}>
		<Trash2Icon />
		Delete
	</Button>
</form>
