<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { FileSearchCornerIcon } from '@lucide/svelte';
</script>

<Empty.Root class="border border-dashed">
	<Empty.Header>
		<Empty.Media variant="icon">
			<FileSearchCornerIcon />
		</Empty.Media>
		<Empty.Title>No applicants yet</Empty.Title>
		<Empty.Description>
			Nobody has applied yet. Once applications start coming in, you'll see them here.
		</Empty.Description>
	</Empty.Header>
</Empty.Root>
