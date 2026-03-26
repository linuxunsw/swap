<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { STATUS_DISPLAY, type ApplicationStatus } from '$lib/constants';

	let { status }: { status: ApplicationStatus } = $props();

	const statusDisplay = $derived(STATUS_DISPLAY[status]);
</script>

<Badge variant={statusDisplay.variant}>
	{statusDisplay.label}
</Badge>
