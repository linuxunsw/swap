<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button, buttonVariants, type ButtonVariant } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import { TriangleAlertIcon } from '@lucide/svelte';

	let {
		open = $bindable(false),
		title,
		description,
		onAction,
		cancelLabel = 'Cancel',
		actionLabel = 'Continue',
		actionVariant = 'default'
	}: {
		open: boolean;
		title: string;
		description: string;
		onAction?: () => void;
		cancelLabel?: string;
		actionLabel?: string;
		actionVariant?: ButtonVariant;
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
				<Button onclick={onAction} variant={actionVariant}>
					{actionLabel}
				</Button>
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>{cancelLabel}</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{:else}
	<AlertDialog.Root bind:open>
		<AlertDialog.Content>
			<AlertDialog.Header>
				{#if actionVariant === 'destructive'}
					<AlertDialog.Media
						class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
					>
						<TriangleAlertIcon />
					</AlertDialog.Media>
				{/if}
				<AlertDialog.Title>{title}</AlertDialog.Title>
				<AlertDialog.Description>{description}</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{cancelLabel}</AlertDialog.Cancel>
				<AlertDialog.Action onclick={onAction} variant={actionVariant}>
					{actionLabel}
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
