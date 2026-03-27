<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	let { label = 'Update status' }: { label?: string } = $props();
</script>

<!-- TODO -->
<Button variant="outline" size="sm" disabled>
	{label} (coming soon)
</Button>
