<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import type { Snippet } from 'svelte';
	import { getResponsiveDialogContext } from './responsive-dialog-context.js';

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: {
		ref?: HTMLDivElement | null;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	const context = getResponsiveDialogContext();
</script>

{#if context.isMobile.current}
	<Drawer.Footer bind:ref {...restProps}>
		{@render children?.()}
	</Drawer.Footer>
{:else}
	<Dialog.Footer bind:ref {...restProps}>
		{@render children?.()}
	</Dialog.Footer>
{/if}
