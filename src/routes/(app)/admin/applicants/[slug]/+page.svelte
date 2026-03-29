<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { STATUS_DISPLAY } from '$lib/constants';
	import { formatDate } from '$lib/utils';
	import ApplicationResponses from '../../../application/application-responses.svelte';
	import PersonalInfo from '../../../application/personal-info.svelte';
	import SelectedSubcommittees from '../../../application/selected-subcommittees.svelte';
	import SubmissionStatus from '../../../application/submission-status.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	const application = $derived(data.application);
	const interview = $derived(application.interview);
	const feedback = $derived(interview?.feedback ?? []);
	const votes = $derived(application.votes ?? []);
	const interviewerName = $derived(
		interview?.interviewer?.name ?? interview?.interviewer?.zid ?? 'TBD'
	);
	const statusDisplay = $derived(STATUS_DISPLAY[application.status]);
</script>

<section class="space-y-6">
	<header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold">{application.fullName}</h1>
			<p class="text-sm text-muted-foreground">Applicant ID: {application.id}</p>
		</div>
		<div class="flex items-center gap-2">
			<Button href="/admin/applicants" variant="outline">Back to applicants</Button>
			<Badge variant={statusDisplay.variant}>{statusDisplay.label}</Badge>
		</div>
	</header>

	<div class="grid gap-6 lg:grid-cols-[320px_1fr]">
		<div class="space-y-6 lg:sticky lg:top-20 lg:self-start">
			<SubmissionStatus
				status={application.status}
				submittedAt={application.submittedAt}
				applicationId={application.id}
			/>
			<SelectedSubcommittees names={data.subcommitteeNames} />

			<Card.Root>
				<Card.Header>
					<Card.Title>Admin metadata</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-2 text-sm">
					<div class="flex items-center justify-between gap-2">
						<span class="text-muted-foreground">Account zID</span>
						<span class="font-medium">{application.user.zid}</span>
					</div>
					<div class="flex items-center justify-between gap-2">
						<span class="text-muted-foreground">Cycle</span>
						<span class="font-medium">{application.cycle.name}</span>
					</div>
					<div class="flex items-center justify-between gap-2">
						<span class="text-muted-foreground">Created</span>
						<span>{formatDate(application.createdAt)}</span>
					</div>
					<div class="flex items-center justify-between gap-2">
						<span class="text-muted-foreground">Updated</span>
						<span>{formatDate(application.updatedAt)}</span>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="min-w-0 space-y-6">
			<PersonalInfo
				fullName={application.fullName}
				discord={application.discord}
				userEmail={application.user.email}
				preferredEmail={application.preferredEmail}
			/>
			<ApplicationResponses reason={application.reason} experience={application.experience} />

			<Separator />

			<section class="space-y-4">
				<h2 class="text-lg font-semibold">Admin review workflow</h2>

				<Card.Root>
					<Card.Header>
						<Card.Title>Interview</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-3 text-sm">
						{#if interview}
							<div class="grid gap-2 sm:grid-cols-2">
								<div>
									<p class="text-muted-foreground">Scheduled at</p>
									<p class="font-medium">{formatDate(interview.scheduledAt)}</p>
								</div>
								<div>
									<p class="text-muted-foreground">Location</p>
									<p class="font-medium">{interview.location || 'TBD'}</p>
								</div>
								<div>
									<p class="text-muted-foreground">Interviewer</p>
									<p class="font-medium">{interviewerName}</p>
								</div>
							</div>
						{:else}
							<p class="text-muted-foreground">No interview has been scheduled yet.</p>
						{/if}

						<Button variant="outline" size="sm" disabled>Schedule interview (coming soon)</Button>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Interview feedback</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-3 text-sm">
						{#if feedback.length > 0}
							<div class="space-y-3">
								{#each feedback as entry (entry.id)}
									<div class="rounded-md border p-3">
										<p class="mb-1 text-xs text-muted-foreground">
											Reviewer: {entry.reviewer?.name ?? entry.reviewer?.zid ?? 'Unknown'}
										</p>
										<p class="whitespace-pre-wrap">{entry.comments}</p>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-muted-foreground">No feedback submitted yet.</p>
						{/if}

						<Button variant="outline" size="sm" disabled>Provide feedback (coming soon)</Button>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Voting</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-3 text-sm">
						<div class="grid grid-cols-3 gap-2">
							<div class="rounded-md border p-3 text-center">
								<p class="text-xs text-muted-foreground">Yes</p>
								<p class="text-lg font-semibold">{data.voteSummary.yes}</p>
							</div>
							<div class="rounded-md border p-3 text-center">
								<p class="text-xs text-muted-foreground">No</p>
								<p class="text-lg font-semibold">{data.voteSummary.no}</p>
							</div>
							<div class="rounded-md border p-3 text-center">
								<p class="text-xs text-muted-foreground">Total</p>
								<p class="text-lg font-semibold">{data.voteSummary.total}</p>
							</div>
						</div>

						{#if votes.length > 0}
							<div class="space-y-1">
								<p class="text-xs text-muted-foreground">Recorded votes</p>
								{#each votes as vote (vote.voterId)}
									<div class="flex items-center justify-between rounded-md border px-3 py-2">
										<span>{vote.voter?.name ?? vote.voter?.zid ?? vote.voterId}</span>
										<Badge variant={vote.value === 1 ? 'default' : 'destructive'}>
											{vote.value === 1 ? 'Yes' : 'No'}
										</Badge>
									</div>
								{/each}
							</div>
						{/if}

						<Button variant="outline" size="sm" disabled>Vote on applicant (coming soon)</Button>
					</Card.Content>
				</Card.Root>
			</section>
		</div>
	</div>
</section>
