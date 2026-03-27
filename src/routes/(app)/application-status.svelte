<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { STATUS_DISPLAY } from '$lib/constants';
	import type { ApplicationStatus } from '$lib/constants/application-status';
	import { formatDate } from '$lib/utils';
	import PenLineIcon from '@lucide/svelte/icons/pen-line';

	type Props = {
		status: ApplicationStatus;
		submittedAt: Date | null;
		subcommitteeNames: string[];
		cycleName: string | null;
		canEdit: boolean;
	};

	let { status, submittedAt, subcommitteeNames, cycleName, canEdit }: Props = $props();

	const display = $derived(STATUS_DISPLAY[status]);
	const formattedDate = $derived(formatDate(submittedAt));
</script>

<Card.Root class="h-fit self-start">
	<Card.Header>
		<Card.Title class="leading-relaxed font-bold @sm:text-2xl @sm:leading-normal">
			Application Status
		</Card.Title>
		{#if cycleName}
			<Card.Description>{cycleName}</Card.Description>
		{/if}
		<Card.Action>
			<Badge variant={display.variant}>{display.label}</Badge>
		</Card.Action>
	</Card.Header>
	<Card.Content class="space-y-4 text-sm">
		<div class="flex items-center justify-between">
			<span class="text-muted-foreground">Submitted</span>
			<span>{formattedDate ?? 'N/A'}</span>
		</div>

		{#if subcommitteeNames.length > 0}
			<Separator />
			<div class="flex items-center justify-between gap-4">
				<span class="shrink-0 text-muted-foreground">Subcommittees</span>
				<div class="flex flex-wrap justify-end gap-1.5">
					{#each subcommitteeNames as name (name)}
						<Badge variant="outline">{name}</Badge>
					{/each}
				</div>
			</div>
		{/if}

		{#if canEdit}
			<Separator />
			<div class="flex items-center justify-between gap-4">
				<span class="text-muted-foreground">
					{status === 'draft' ? 'Your draft is not yet submitted.' : 'You can still make changes.'}
				</span>
				<Button variant="outline" size="sm" href="/apply" class="shrink-0">
					<PenLineIcon class="size-3.5" />
					Edit
				</Button>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
