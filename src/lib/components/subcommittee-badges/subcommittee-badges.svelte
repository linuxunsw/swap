<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { swapBadgeVariants } from '$lib/constants';
	import type { SubcommitteeOption } from '$lib/server/controllers/subcommittee';
	import { ChevronLeftIcon } from '@lucide/svelte';
	import {
		DEFAULT_BADGE_OVERFLOW_SIZING,
		getHiddenCount,
		getVisibleCount,
		type BadgeOverflowSizing
	} from './utils';

	type Props = {
		subcommittees: SubcommitteeOption[];
		maxWidth: number;
		expanded?: boolean;
		onToggleExpanded?: (expanded: boolean) => void;
		emptyLabel?: string;
		sizing?: Partial<BadgeOverflowSizing>;
	};

	let {
		subcommittees,
		maxWidth,
		expanded = $bindable(false),
		onToggleExpanded,
		emptyLabel = 'None',
		sizing = {}
	}: Props = $props();

	const resolvedSizing = $derived({ ...DEFAULT_BADGE_OVERFLOW_SIZING, ...sizing });
	const total = $derived(subcommittees.length);
	const visible = $derived(getVisibleCount(total, maxWidth, expanded, resolvedSizing));
	const hidden = $derived(getHiddenCount(total, maxWidth, resolvedSizing));

	const getBadgeClassName = (subcommittee: SubcommitteeOption) =>
		swapBadgeVariants[subcommittee.colour % swapBadgeVariants.length];

	const toggleExpanded = (next: boolean) => {
		expanded = next;
		onToggleExpanded?.(next);
	};
</script>

{#if total === 0}
	<span class="text-muted-foreground">{emptyLabel}</span>
{:else}
	<div
		class={`flex gap-2 pr-1 ${expanded ? 'flex-wrap' : 'flex-nowrap overflow-hidden'}`}
		style={!expanded ? `max-width: ${maxWidth}px;` : undefined}
	>
		{#each subcommittees.slice(0, visible) as subcommittee, index (`${subcommittee.id}-${index}`)}
			<Badge class={`shrink-0 ${getBadgeClassName(subcommittee)}`}>
				{subcommittee.name}
			</Badge>
		{/each}

		{#if !expanded && hidden > 0}
			<button
				type="button"
				class="cursor-pointer"
				aria-label={`Show ${hidden} more items`}
				onclick={() => toggleExpanded(true)}
			>
				<Badge variant="outline" class="h-5 min-w-5 shrink-0 px-1 font-mono tabular-nums"
					>+{hidden}</Badge
				>
			</button>
		{/if}

		{#if expanded && hidden > 0}
			<button
				type="button"
				class="cursor-pointer"
				aria-label="Collapse item list"
				onclick={() => toggleExpanded(false)}
			>
				<Badge variant="outline" class="h-5 min-w-5 shrink-0 px-1"><ChevronLeftIcon /></Badge>
			</button>
		{/if}
	</div>
{/if}
