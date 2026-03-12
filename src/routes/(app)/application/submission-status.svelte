<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { STATUS_DISPLAY, type ApplicationStatus } from '$lib/constants';
	import { formatDate } from '$lib/utils';

	type Props = {
		status: ApplicationStatus;
		submittedAt: Date | null;
		applicationId: string;
	};

	let { status, submittedAt, applicationId }: Props = $props();

	const display = $derived(STATUS_DISPLAY[status]);
	const formattedDate = $derived(formatDate(submittedAt));
</script>

<Card.Root class="gap-2">
	<Card.Header>
		<Card.Title>Submission status</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-3 text-sm">
		<div class="flex items-center justify-between">
			<span class="text-muted-foreground">Status</span>
			<Badge variant={display.variant}>{display.label}</Badge>
		</div>
		<div class="flex items-center justify-between">
			<span class="text-muted-foreground">Date</span>
			<span>{formattedDate ?? 'N/A'}</span>
		</div>
		<div class="flex items-center justify-between">
			<span class="text-muted-foreground">Application ID</span>
			<span class="font-mono text-xs">{applicationId.slice(0, 8)}</span>
		</div>
	</Card.Content>
</Card.Root>
