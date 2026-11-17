<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.ts';
	import type { ApplicationStatus } from '#lib/constants/application-status.ts';
	import { STATUS_DISPLAY_ICON } from '#lib/constants/status-icon.ts';

	let { status }: { status: ApplicationStatus } = $props();

	const statusDisplay = $derived(STATUS_DISPLAY_ICON[status]);
</script>

<Badge variant={statusDisplay.variant}>
	<statusDisplay.icon />
	{statusDisplay.label}
</Badge>
