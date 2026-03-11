<script lang="ts">
	import type { PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import EmptyApplication from '$lib/components/empty-application.svelte';
	import PenLineIcon from '@lucide/svelte/icons/pen-line';
	import SubmissionStatus from './submission-status.svelte';
	import SelectedSubcommittees from './selected-subcommittees.svelte';
	import PersonalInfo from './personal-info.svelte';
	import ApplicationResponses from './application-responses.svelte';

	let { data }: { data: PageServerData } = $props();

	const app = $derived(data.application);
	const canEdit = $derived(app?.status === 'draft' || app?.status === 'submitted');
</script>

{#if !app}
	<section class="mx-auto max-w-3xl py-10">
		<EmptyApplication />
	</section>
{:else}
	<div class="space-y-8">
		<section class="grid gap-6 lg:grid-cols-[320px_1fr]">
			<!-- left column -->
			<div class="space-y-6">
				<SubmissionStatus
					status={app.status}
					submittedAt={app.submittedAt}
					applicationId={app.id}
				/>
				<SelectedSubcommittees names={data.subcommitteeNames} />
			</div>

			<!-- main column -->
			<div class="space-y-6">
				<PersonalInfo
					fullName={app.fullName}
					discord={app.discord}
					userEmail={data.userEmail}
					preferredEmail={app.preferredEmail}
				/>
				<ApplicationResponses reason={app.reason} experience={app.experience} />
			</div>
		</section>

		{#if canEdit}
			<Separator />
			<section class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p class="text-sm font-medium">Need to make changes?</p>
					<p class="text-sm text-muted-foreground">
						You can edit your application until an interview is scheduled.
					</p>
				</div>
				<Button variant="outline" href="/apply">
					<PenLineIcon class="size-3.5" />
					Edit application
				</Button>
			</section>
		{/if}
	</div>
{/if}
