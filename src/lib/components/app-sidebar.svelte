<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { getNavGroups } from '$lib/nav';
	import SignOutButton from './sign-out-button.svelte';
	import Separator from './ui/separator/separator.svelte';

	const { zid }: { zid: string | null } = $props();
	const sidebar = Sidebar.useSidebar();

	const navGroups = $derived(getNavGroups(page.data.role));
</script>

<Sidebar.Root variant="inset">
	<Sidebar.Header>
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:p-1.5!">
						{#snippet child({ props })}
							<div class="flex h-8 items-center space-x-2">
								<span class="text-4xl font-bold">SWAP</span>
								<Separator orientation="vertical" />
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
		{#each navGroups as { title: groupLabel, items: navOptions } (groupLabel)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{groupLabel}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each navOptions as item (item.href)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									size={sidebar.isMobile ? 'lg' : 'default'}
									isActive={page.url.pathname === item.href}
								>
									{#snippet child({ props })}
										<a
											href={resolve(item.href)}
											onclick={() => {
												sidebar.setOpenMobile(false);
												// there's a bug where the screen lock gets reapplied after opening a drawer at the same time
												// as the onclick on mobile, e.g when handling a tainted form state on mobile with a responsive dialog.
												// the issue doesn't happen with the alert dialog.
												// similar (but not identical) issue: https://github.com/huntabyte/shadcn-svelte/issues/1549
												document.body.style.pointerEvents = '';
												document.body.style.overflow = '';
											}}
											{...props}
										>
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
		{/each}
	</Sidebar.Content>

	<Sidebar.Footer>
		<SignOutButton />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
