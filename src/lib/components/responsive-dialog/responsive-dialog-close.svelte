<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { getResponsiveDialogContext } from './responsive-dialog-context.js';

	let {
		ref = $bindable(null),
		...restProps
	}: {
		ref?: HTMLButtonElement | null;
		[key: string]: unknown;
	} = $props();

	const context = getResponsiveDialogContext();
</script>

{#if context.isMobile.current}
	<Drawer.Close bind:ref {...restProps} />
{:else}
	<Dialog.Close bind:ref {...restProps} />
{/if}
