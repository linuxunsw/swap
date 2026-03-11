<script lang="ts">
	import type { PageServerData } from './$types';
	import EmptyApplication from '$lib/components/empty-application.svelte';
	import ApplicationStatus from './application-status.svelte';
	import ApplicationTimeline from './application-timeline.svelte';
	import DashboardFaq from './dashboard-faq.svelte';
	import DashboardQuickLinks from './dashboard-quick-links.svelte';

	let { data }: { data: PageServerData } = $props();

	const closesAt = $derived(data.cycle?.closesAt ?? null);
	const closesFormatted = $derived(
		closesAt
			? new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium', timeStyle: 'short' }).format(
					closesAt
				)
			: null
	);
</script>

{#if !data.application}
	<section class="mx-auto max-w-3xl py-10">
		<EmptyApplication />
	</section>
{:else}
	<div class="mx-auto w-full max-w-3xl space-y-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			{#if closesFormatted}
				<p class="text-sm text-muted-foreground">
					Applications close <span class="font-medium text-foreground">{closesFormatted}</span>
				</p>
			{/if}
				<DashboardQuickLinks
			canEdit={data.application.status === 'draft' || data.application.status === 'submitted'}
		/>
		</div>

		<div class="grid gap-6 sm:grid-cols-[1fr_auto]">
			<ApplicationStatus
				status={data.application.status}
				submittedAt={data.application.submittedAt}
				subcommitteeNames={data.subcommitteeNames}
				cycleName={data.cycle?.name ?? null}
			/>
			<ApplicationTimeline status={data.application.status} />
		</div>
		
		<DashboardFaq />
	</div>
{/if}
