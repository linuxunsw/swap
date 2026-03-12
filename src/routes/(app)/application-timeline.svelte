<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { APPLICATION_STAGES, APPLICATION_STATUSES, type ApplicationStatus } from '$lib/constants';
	import CheckIcon from '@lucide/svelte/icons/check';
	import CircleIcon from '@lucide/svelte/icons/circle';
	import CircleDotIcon from '@lucide/svelte/icons/circle-dot';

	type Props = {
		status: ApplicationStatus;
	};

	let { status }: Props = $props();

	function getStageState(
		stage: (typeof APPLICATION_STAGES)[number],
		currentStatus: ApplicationStatus
	) {
		const stageIdxs = stage.key.map((k) => APPLICATION_STATUSES.indexOf(k));
		const stageMinIdx = Math.min(...stageIdxs);
		const stageMaxIdx = Math.max(...stageIdxs);

		const currentIdx = APPLICATION_STATUSES.indexOf(currentStatus);

		if (currentIdx > stageMaxIdx) return 'completed';
		if (currentIdx >= stageMinIdx && currentIdx <= stageMaxIdx) return 'current';
		return 'upcoming';
	}
</script>

<Card.Root class="h-fit self-start">
	<Card.Header>
		<Card.Title>Timeline</Card.Title>
		<Card.Description></Card.Description>
	</Card.Header>
	<Card.Content>
		<ol class="mx-auto w-fit space-y-0">
			{#each APPLICATION_STAGES as stage, i (stage.key)}
				{@const state = getStageState(stage, status)}
				<li class="relative flex gap-3 {i < APPLICATION_STAGES.length - 1 ? 'pb-5' : ''}">
					<!-- Vertical connector line -->
					{#if i < APPLICATION_STAGES.length - 1}
						<div
							class="absolute top-7 bottom-0 left-3 w-px {state === 'completed'
								? 'bg-primary'
								: 'bg-border'}"
						></div>
					{/if}
					<!-- Step circle -->
					<div
						class="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full
                        {state === 'completed'
							? 'bg-primary text-primary-foreground'
							: state === 'current'
								? 'border-2 border-primary bg-background text-primary'
								: 'border border-border bg-background text-muted-foreground/40'}"
					>
						{#if state === 'completed'}
							<CheckIcon class="size-3" />
						{:else if state === 'current'}
							<CircleDotIcon class="size-3" />
						{:else}
							<CircleIcon class="size-3" />
						{/if}
					</div>
					<!-- Label -->
					<span
						class="pt-0.5 text-sm {state === 'current'
							? 'font-semibold text-foreground'
							: state === 'completed'
								? 'text-foreground'
								: 'text-muted-foreground'}"
					>
						{stage.label}
					</span>
				</li>
			{/each}
		</ol>
	</Card.Content>
</Card.Root>
