<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';

	let {
		open = $bindable(false),
		title,
		description,
		onAction,
		cancelLabel = 'Cancel',
		actionLabel = 'Continue'
	}: {
		open: boolean;
		title: string;
		description: string;
		onAction?: () => void;
		cancelLabel?: string;
		actionLabel?: string;
	} = $props();

	const isMobile = new IsMobile();
</script>

{#if isMobile.current}
	<Drawer.Root bind:open>
		<Drawer.Content>
			<Drawer.Header class="text-start">
				<Drawer.Title>{title}</Drawer.Title>
				<Drawer.Description>{description}</Drawer.Description>
			</Drawer.Header>
			<Drawer.Footer class="pt-2">
				<button class={buttonVariants()} onclick={onAction}>{actionLabel}</button>
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>{cancelLabel}</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{:else}
	<AlertDialog.Root bind:open>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>{title}</AlertDialog.Title>
				<AlertDialog.Description>{description}</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{cancelLabel}</AlertDialog.Cancel>
				<AlertDialog.Action onclick={onAction}>{actionLabel}</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
