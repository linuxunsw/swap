<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import {
		RESPONSIVE_DIALOG_CONTEXT,
		type ResponsiveDialogContext
	} from './responsive-dialog-context.js';

	let {
		open = $bindable(false),
		children,
		shouldScaleBackground = true,
		activeSnapPoint = $bindable(null),
		drawerDirection = 'bottom'
	}: {
		open?: boolean;
		children?: Snippet;
		shouldScaleBackground?: boolean;
		activeSnapPoint?: string | number | null;
		drawerDirection?: 'top' | 'bottom' | 'left' | 'right';
	} = $props();

	const isMobile = new IsMobile();

	setContext<ResponsiveDialogContext>(RESPONSIVE_DIALOG_CONTEXT, {
		isMobile
	});
</script>

{#if isMobile.current}
	<Drawer.Root bind:open {shouldScaleBackground} bind:activeSnapPoint direction={drawerDirection}>
		{@render children?.()}
	</Drawer.Root>
{:else}
	<Dialog.Root bind:open>
		{@render children?.()}
	</Dialog.Root>
{/if}
