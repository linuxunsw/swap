<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { navTitle } from '$lib/nav';
	import ModeToggle from '$lib/components/mode-toggle.svelte';

	const title = $derived(page.data.routeTitle ?? navTitle(page.url.pathname));
</script>

<header
	class="sticky top-0 z-50 flex h-(--header-height) w-full shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
>
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ms-1" />
		<Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
		<h1 class="text-base font-medium">{title}</h1>
		<div class="ms-auto flex items-center gap-2">
			<Button
				href="https://github.com/linuxunsw/swap"
				variant="ghost"
				size="sm"
				class="hidden sm:flex dark:text-foreground"
				target="_blank"
				rel="noopener noreferrer"
			>
				GitHub
			</Button>
			<ModeToggle />
		</div>
	</div>
</header>
