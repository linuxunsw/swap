<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Maximize2Icon } from '@lucide/svelte';

	let { id }: { id: string } = $props();
</script>

<Button
	variant="ghost"
	size="sm"
	href={`/admin/applicants/${id}`}
	onclick={(event) => event.stopPropagation()}
>
	<Maximize2Icon />
</Button>
