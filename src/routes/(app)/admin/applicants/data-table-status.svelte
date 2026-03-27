<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import type { ApplicationStatus } from '$lib/constants/application-status';
	import { STATUS_DISPLAY_ICON } from '$lib/constants/status-icon';

	let { status }: { status: ApplicationStatus } = $props();

	const statusDisplay = $derived(STATUS_DISPLAY_ICON[status]);
</script>

<Badge variant={statusDisplay.variant}>
	<statusDisplay.icon />
	{statusDisplay.label}
</Badge>
