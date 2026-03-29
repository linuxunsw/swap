<script lang="ts">
	import { PUBLIC_SOCIETY_WEBSITE } from '$env/static/public';
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import CalendarOffIcon from '@lucide/svelte/icons/calendar-off';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
	<title>Applications Closed | SWAP</title>
</svelte:head>

<div class="flex min-h-svh flex-col">
	<header class="flex items-center justify-between border-b px-4 py-3">
		<span class="text-sm text-muted-foreground"
			>Signed in as <span class="font-medium text-foreground">{data.zid}</span></span
		>
		<div class="flex items-center gap-2">
			<ModeToggle />
			<form method="post" action="/sign-out">
				<Button type="submit" variant="ghost" size="sm">
					<LogOutIcon class="size-4" />
					Sign out
				</Button>
			</form>
		</div>
	</header>
	<main class="flex flex-1 items-center justify-center px-4">
		<Empty.Root class="max-w-md border border-dashed">
			<Empty.Header>
				<Empty.Media variant="icon">
					<CalendarOffIcon />
				</Empty.Media>
				<Empty.Title>Applications are closed</Empty.Title>
				<Empty.Description>
					New applications are currently closed. Check back later when applications reopen. Keep an
					eye out on our socials!
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<div class="flex flex-wrap justify-center gap-2">
					<Button
						variant="outline"
						size="sm"
						href={PUBLIC_SOCIETY_WEBSITE}
						target="_blank"
						rel="noopener"
					>
						Go to Main Site
					</Button>
				</div>
			</Empty.Content>
		</Empty.Root>
	</main>
</div>
