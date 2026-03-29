<script lang="ts">
	import { SubcommitteeBadges } from '$lib/components/subcommittee-badges';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import type { ApplicationCycleWithSubcommittees } from '$lib/server/controllers/application-cycle';
	import { SquarePenIcon } from '@lucide/svelte';

	type Props = {
		cycles: ApplicationCycleWithSubcommittees[];
	};
	type CycleId = ApplicationCycleWithSubcommittees['id'];

	let { cycles }: Props = $props();
	const isMobile = new IsMobile(530);
	let tableWidth = $state(0);
	let expandedCycleKeys = $state<Record<string, boolean>>({});

	const NAME_COLUMN_ESTIMATE_PX = 80;
	const DATE_COLUMN_ESTIMATE_PX = 90;
	const ACTIONS_COLUMN_ESTIMATE_PX = 32;
	const TABLE_CHROME_PX = 32;
	const MIN_SUBCOMMITTEE_WIDTH_PX = 120;

	const timeFormatOptions: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: 'short',
		year: '2-digit'
	};

	const formatDate = (value: string | Date) =>
		new Date(value).toLocaleDateString('en-AU', timeFormatOptions);

	const isCurrentCycle = (opensAt: string | Date, closesAt: string | Date) => {
		const now = new Date();
		return new Date(opensAt) <= now && now <= new Date(closesAt);
	};

	const getCycleKey = (cycleId: CycleId) => String(cycleId);
	const isCycleExpanded = (cycleId: CycleId) => !!expandedCycleKeys[getCycleKey(cycleId)];

	const setCycleExpanded = (cycleId: CycleId, expanded: boolean) => {
		expandedCycleKeys = { ...expandedCycleKeys, [getCycleKey(cycleId)]: expanded };
	};

	const subcommitteeColumnWidth = $derived.by(() => {
		if (isMobile.current) return 0;

		const fixedColumnsEstimate =
			NAME_COLUMN_ESTIMATE_PX +
			DATE_COLUMN_ESTIMATE_PX +
			DATE_COLUMN_ESTIMATE_PX +
			ACTIONS_COLUMN_ESTIMATE_PX +
			TABLE_CHROME_PX;

		return Math.max(MIN_SUBCOMMITTEE_WIDTH_PX, tableWidth - fixedColumnsEstimate);
	});
</script>

<div class="border" bind:clientWidth={tableWidth}>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>Opens At</Table.Head>
				<Table.Head>Closes At</Table.Head>
				<Table.Head hidden={isMobile.current}>Subcommittees</Table.Head>
				<Table.Head class="w-px pr-4">
					<span class="sr-only">Actions</span>
				</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each cycles as cycle (cycle.id)}
				<Table.Row>
					<Table.Cell>
						<div class="flex items-center gap-1 font-bold sm:gap-2">
							{cycle.name}
							{#if isCurrentCycle(cycle.opensAt, cycle.closesAt)}
								<Badge class="h-2 min-w-2 rounded-full bg-badge-3 px-px text-badge-foreground" />
							{/if}
						</div>
					</Table.Cell>
					<Table.Cell>{formatDate(cycle.opensAt)}</Table.Cell>
					<Table.Cell>{formatDate(cycle.closesAt)}</Table.Cell>
					<Table.Cell hidden={isMobile.current}>
						<SubcommitteeBadges
							subcommittees={cycle.subcommittees.map((sub) => sub.subcommittee)}
							expanded={isCycleExpanded(cycle.id)}
							maxWidth={subcommitteeColumnWidth}
							onToggleExpanded={(expanded) => setCycleExpanded(cycle.id, expanded)}
						/>
					</Table.Cell>

					<Table.Cell class="w-px pr-4">
						<Button
							aria-label="Edit cycle"
							variant="ghost"
							size="icon"
							href={`/admin/cycles/${cycle.id}/edit`}
						>
							<SquarePenIcon />
						</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
