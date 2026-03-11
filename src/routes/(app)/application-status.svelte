<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { STATUS_DISPLAY, type ApplicationStatus } from '$lib/constants';
	import PenLineIcon from '@lucide/svelte/icons/pen-line';

	type Props = {
		status: ApplicationStatus;
		submittedAt: Date | null;
		subcommitteeNames: string[];
		cycleName: string | null;
	};

	let { status, submittedAt, subcommitteeNames, cycleName }: Props = $props();

	const canEdit = $derived(status === 'draft' || status === 'submitted');
	const display = $derived(STATUS_DISPLAY[status]);

	const formattedDate = $derived(
		submittedAt
			? new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium', timeStyle: 'short' }).format(
					submittedAt
				)
			: null
	);
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
					{#each subcommitteeNames as name}
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
