<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { APPLICANT_NAV } from '$lib/nav';
	import SignOutButton from './sign-out-button.svelte';
	import Separator from './ui/separator/separator.svelte';

	const { zid }: { zid: string | null } = $props();
</script>

<Sidebar.Root variant="inset">
	<Sidebar.Header>
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:p-1.5!">
						{#snippet child({ props })}
							<div class="flex flex-row items-center">
								<span class="text-4xl font-bold">SWAP</span>
								<Separator class="mx-2 h-8" orientation="vertical" />
								<div {...props} class="flex flex-col items-start">
									<span class="text-sm font-medium">Logged in:</span>
									<span class="text-sm text-muted-foreground">{zid}</span>
								</div>
							</div>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Applicant</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each APPLICANT_NAV as item (item.href)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={page.url.pathname === item.href}>
								{#snippet child({ props })}
									<a href={resolve(item.href)} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<SignOutButton />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
