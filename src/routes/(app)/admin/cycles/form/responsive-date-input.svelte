<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import {
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		today,
		type DateValue
	} from '@internationalized/date';
	import CalendarPlusIcon from '@lucide/svelte/icons/calendar-plus';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';

	type Props = {
		id: string;
		name: string;

		value: string | undefined;
		description?: string;
	};

	let { id, name, value = $bindable<string | undefined>(undefined), description }: Props = $props();
	let open = $state(false);

	const df = new DateFormatter('en-AU', { dateStyle: 'medium' });

	const calDate = $derived.by(() => {
		if (!value) return undefined;
		try {
			return parseDate(value);
		} catch {
			return undefined;
		}
	});

	const triggerLabel = $derived.by(() => {
		if (calDate) return df.format(calDate.toDate(getLocalTimeZone()));
		return 'Select date';
	});

	const isMobile = new IsMobile();

	const handleValueChange = (v: DateValue | undefined) => {
		if (v) {
			value = v.toString();
			open = false;
		} else {
			value = '';
		}
	};
</script>

{#if isMobile.current}
	<Drawer.Root bind:open>
		<Drawer.Trigger {id}>
			{#snippet child({ props })}
				<Button {...props} variant="outline" class="w-48 justify-between font-normal">
					{triggerLabel}
					<CalendarPlusIcon />
				</Button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content class="w-auto overflow-hidden p-0">
			<Drawer.Header class="sr-only">
				<Drawer.Title>Select date</Drawer.Title>
				<Drawer.Description>{description}</Drawer.Description>
			</Drawer.Header>
			<Calendar
				type="single"
				value={calDate as DateValue}
				captionLayout="dropdown"
				onValueChange={(v) => {
					handleValueChange(v);
				}}
				minValue={today(getLocalTimeZone())}
				class="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)]"
			/>
		</Drawer.Content>
	</Drawer.Root>
{:else}
	<Popover.Root bind:open>
		<Popover.Trigger {id}>
			{#snippet child({ props })}
				<Button {...props} variant="outline" class="w-48 justify-between font-normal">
					{triggerLabel}
					{#if open}
						<ChevronUpIcon />
					{:else}
						<ChevronDownIcon />
					{/if}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto overflow-hidden p-0" align="start">
			<Calendar
				type="single"
				value={calDate as DateValue}
				captionLayout="dropdown"
				onValueChange={(v) => {
					handleValueChange(v);
				}}
				minValue={today(getLocalTimeZone())}
			/>
		</Popover.Content>
	</Popover.Root>
{/if}

<input hidden {name} value={value ?? ''} />
