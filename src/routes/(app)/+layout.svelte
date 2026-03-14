<script lang="ts">
	import { page } from '$app/state';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { navTitle } from '$lib/nav';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';

	let { children, data } = $props();
	const title = $derived(page.data.routeTitle ?? navTitle(page.url.pathname, page.data.role));

	const flash = getFlash(page);
	$effect(() => {
		if (!$flash) return;
		toast.success($flash);
		$flash = undefined;
	});
</script>

<svelte:head>
	<title>{title} | SWAP</title>
</svelte:head>

<Sidebar.Provider>
	<AppSidebar zid={data.zid} />
	<Sidebar.Inset>
		<SiteHeader {title} />
		<div class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-10">
			{@render children?.()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
