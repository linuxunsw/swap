<script lang="ts">
    import * as Empty from '$lib/components/ui/empty/index.js';
    import { FileSearchCornerIcon } from '@lucide/svelte';
    import { Button } from '$lib/components/ui/button/index.js';
</script>

<Empty.Root class="border border-dashed">
	<Empty.Header>
		<Empty.Media variant="icon">
			<FileSearchCornerIcon />
		</Empty.Media>
		<Empty.Title>No application found</Empty.Title>
		<Empty.Description>
			It looks like you haven't started your application yet. Click the button below to get started.
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button variant="outline" size="sm" href="/apply">Start application</Button>
	</Empty.Content>
</Empty.Root>
