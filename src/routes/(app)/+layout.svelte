<script lang="ts">
    import * as Sidebar from '$lib/components/ui/sidebar/index.js';
    import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';

    let { children, data } = $props();
</script>

<Sidebar.Provider>
  <AppSidebar zid={data.zid} />
  <Sidebar.Inset>
    <SiteHeader />
    <div class="flex flex-1 flex-col gap-4 px-4 py-10 mx-auto w-full max-w-5xl">
        {@render children?.()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>