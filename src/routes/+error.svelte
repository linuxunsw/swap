<script lang="ts">
	import { page } from '$app/state';
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<main class="flex min-h-svh items-center justify-center px-4">
	<Empty.Root>
		<Empty.Header>
			<Empty.Title class="text-4xl font-bold">{page.status} - {page.error?.message}</Empty.Title>
			<Empty.Description>
				Something went wrong while trying to load this page. Try refreshing, or head back to the
				homepage.
			</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<Button variant="outline" size="sm" href="/">Back to Home Page</Button>
		</Empty.Content>
	</Empty.Root>
</main>
