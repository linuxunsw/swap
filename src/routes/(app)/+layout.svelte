<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
  import { page } from '$app/state';
	import { navTitle } from '$lib/nav';

	let { children, data } = $props();

  const title = $derived(page.data.routeTitle ?? navTitle(page.url.pathname));
</script>

<svelte:head>
	<title>{title} | SWAP</title>
</svelte:head>

<Sidebar.Provider>
	<AppSidebar zid={data.zid} />
	<Sidebar.Inset>
		<SiteHeader />
		<div class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-10">
			{@render children?.()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
