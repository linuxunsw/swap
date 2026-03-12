<script lang="ts">
	import EmptyApplication from '$lib/components/empty-application.svelte';
	import { formatDate } from '$lib/utils';
	import type { PageServerData } from './$types';
	import ApplicationStatus from './application-status.svelte';
	import ApplicationTimeline from './application-timeline.svelte';
	import DashboardFaq from './dashboard-faq.svelte';

	let { data }: { data: PageServerData } = $props();

	const closesFormatted = $derived(formatDate(data.cycle?.closesAt));
</script>

{#if !data.application}
	<section class="mx-auto max-w-3xl py-10">
		<EmptyApplication />
	</section>
{:else}
	<div class="mx-auto w-full max-w-3xl space-y-6">
		{#if closesFormatted}
			<p class="text-sm text-muted-foreground">
				Applications close <span class="font-medium text-foreground">{closesFormatted}</span>
			</p>
		{/if}

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
