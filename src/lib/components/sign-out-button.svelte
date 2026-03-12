<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import SignOutIcon from '@lucide/svelte/icons/log-out';
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<form method="post" action="/sign-out">
			<Sidebar.MenuButton size="lg" variant="outline">
				{#snippet child({ props })}
					<Button type="submit" variant="secondary" size="lg" class="w-full" {...props}>
						<SignOutIcon class="ml-auto" />
						<span class="mr-auto">Sign Out</span>
					</Button>
				{/snippet}
			</Sidebar.MenuButton>
		</form>
	</Sidebar.MenuItem>
</Sidebar.Menu>
