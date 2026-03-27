import {
	BadgeCheckIcon,
	CalendarClockIcon,
	CircleXIcon,
	SearchIcon,
	SendIcon,
	SquarePenIcon,
	UserRoundCheckIcon
} from '@lucide/svelte';
import type { Component } from 'svelte';
import type { ButtonVariant } from '../components/ui/button';
import { APPLICATION_STATUSES, type ApplicationStatus } from './application-status';
import { cn } from '../utils';

// Auth related
export type Role = 'user' | 'admin';
export const ZID_REGEX = /^z\d{7}$/;
export const OTP_REGEX = /^\d{6}$/;

// UI related
export const STATUS_DISPLAY: Record<ApplicationStatus, { label: string; variant: ButtonVariant }> =
	{
		draft: { label: 'Draft', variant: 'secondary' },
		submitted: { label: 'Submitted', variant: 'default' },
		interview_scheduled: { label: 'Interview Scheduled', variant: 'default' },
		interviewed: { label: 'Interviewed', variant: 'default' },
		under_review: { label: 'Under Review', variant: 'default' },
		offered: { label: 'Offered', variant: 'default' },
		rejected: { label: 'Rejected', variant: 'destructive' }
	};

export const STATUS_DISPLAY_ICON: Record<
	ApplicationStatus,
	{ label: string; variant: ButtonVariant; icon: Component }
> = {
	draft: { label: 'Draft', variant: 'outline', icon: SquarePenIcon },
	submitted: { label: 'Submitted', variant: 'default', icon: SendIcon },
	interview_scheduled: {
		label: 'Interview Scheduled',
		variant: 'default',
		icon: CalendarClockIcon
	},
	interviewed: { label: 'Interviewed', variant: 'default', icon: UserRoundCheckIcon },
	under_review: { label: 'Under Review', variant: 'default', icon: SearchIcon },
	offered: { label: 'Offered', variant: 'default', icon: BadgeCheckIcon },
	rejected: { label: 'Rejected', variant: 'destructive', icon: CircleXIcon }
};

// Simplified timeline stages visible to applicants.
export const APPLICATION_STAGES: { key: ApplicationStatus[]; label: string }[] = [
	{ key: ['draft'], label: 'Draft' },
	{ key: ['submitted'], label: 'Submitted' },
	{ key: ['interview_scheduled', 'interviewed'], label: 'Interview' },
	{ key: ['under_review'], label: 'Under Review' },
	{ key: ['offered', 'rejected'], label: 'Decision' }
];

export const swapBadgeVariants = [
	'bg-badge-1 text-badge-foreground',
	'bg-badge-2 text-badge-foreground',
	'bg-badge-3 text-badge-foreground',
	'bg-badge-4 text-badge-foreground',
	'bg-badge-5 text-badge-foreground',
	'bg-badge-6 text-badge-foreground',
	'bg-badge-7 text-badge-foreground',
	'bg-badge-8 text-badge-foreground'
] as const;
export type SwapBadgeVariant = (typeof swapBadgeVariants)[number];

const checkboxBaseVariant = 'border-foreground';
const choiceCardBaseVariant = cn(
	'flex items-start gap-3 w-full rounded-md border p-4 shadow-sm transition-colors',
	'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
);

export const checkboxVariants = [
	cn(
		checkboxBaseVariant,
		'data-[state=checked]:border-badge-1 data-[state=checked]:bg-badge-1 data-[state=checked]:text-badge-foreground',
		'dark:data-[state=checked]:border-badge-1 dark:data-[state=checked]:bg-badge-1 dark:data-[state=checked]:text-badge-foreground'
	),
	cn(
		checkboxBaseVariant,
		'data-[state=checked]:border-badge-2 data-[state=checked]:bg-badge-2 data-[state=checked]:text-badge-foreground',
		'dark:data-[state=checked]:border-badge-2 dark:data-[state=checked]:bg-badge-2 dark:data-[state=checked]:text-badge-foreground'
	),
	cn(
		checkboxBaseVariant,
		'data-[state=checked]:border-badge-3 data-[state=checked]:bg-badge-3 data-[state=checked]:text-badge-foreground',
		'dark:data-[state=checked]:border-badge-3 dark:data-[state=checked]:bg-badge-3 dark:data-[state=checked]:text-badge-foreground'
	),
	cn(
		checkboxBaseVariant,
		'data-[state=checked]:border-badge-4 data-[state=checked]:bg-badge-4 data-[state=checked]:text-badge-foreground',
		'dark:data-[state=checked]:border-badge-4 dark:data-[state=checked]:bg-badge-4 dark:data-[state=checked]:text-badge-foreground'
	),
	cn(
		checkboxBaseVariant,
		'data-[state=checked]:border-badge-5 data-[state=checked]:bg-badge-5 data-[state=checked]:text-badge-foreground',
		'dark:data-[state=checked]:border-badge-5 dark:data-[state=checked]:bg-badge-5 dark:data-[state=checked]:text-badge-foreground'
	),
	cn(
		checkboxBaseVariant,
		'data-[state=checked]:border-badge-6 data-[state=checked]:bg-badge-6 data-[state=checked]:text-badge-foreground',
		'dark:data-[state=checked]:border-badge-6 dark:data-[state=checked]:bg-badge-6 dark:data-[state=checked]:text-badge-foreground'
	),
	cn(
		checkboxBaseVariant,
		'data-[state=checked]:border-badge-7 data-[state=checked]:bg-badge-7 data-[state=checked]:text-badge-foreground',
		'dark:data-[state=checked]:border-badge-7 dark:data-[state=checked]:bg-badge-7 dark:data-[state=checked]:text-badge-foreground'
	),
	cn(
		checkboxBaseVariant,
		'data-[state=checked]:border-badge-8 data-[state=checked]:bg-badge-8 data-[state=checked]:text-badge-foreground',
		'dark:data-[state=checked]:border-badge-8 dark:data-[state=checked]:bg-badge-8 dark:data-[state=checked]:text-badge-foreground'
	)
] as const;

export const choiceCardVariants = [
	cn(
		choiceCardBaseVariant,
		'bg-badge-1/20 hover:bg-badge-1/30 has-[aria-checked=true]:border-badge-1 has-[aria-checked=true]:bg-badge-1/50'
	),
	cn(
		choiceCardBaseVariant,
		'bg-badge-2/20 hover:bg-badge-2/30 has-[aria-checked=true]:border-badge-2 has-[aria-checked=true]:bg-badge-2/50'
	),
	cn(
		choiceCardBaseVariant,
		'bg-badge-3/20 hover:bg-badge-3/30 has-[aria-checked=true]:border-badge-3 has-[aria-checked=true]:bg-badge-3/50'
	),
	cn(
		choiceCardBaseVariant,
		'bg-badge-4/20 hover:bg-badge-4/30 has-[aria-checked=true]:border-badge-4 has-[aria-checked=true]:bg-badge-4/50'
	),
	cn(
		choiceCardBaseVariant,
		'bg-badge-5/20 hover:bg-badge-5/30 has-[aria-checked=true]:border-badge-5 has-[aria-checked=true]:bg-badge-5/50'
	),
	cn(
		choiceCardBaseVariant,
		'bg-badge-6/20 hover:bg-badge-6/30 has-[aria-checked=true]:border-badge-6 has-[aria-checked=true]:bg-badge-6/50'
	),
	cn(
		choiceCardBaseVariant,
		'bg-badge-7/20 hover:bg-badge-7/30 has-[aria-checked=true]:border-badge-7 has-[aria-checked=true]:bg-badge-7/50'
	),
	cn(
		choiceCardBaseVariant,
		'bg-badge-8/20 hover:bg-badge-8/30 has-[aria-checked=true]:border-badge-8 has-[aria-checked=true]:bg-badge-8/50'
	)
] as const;

export type ChoiceCardVariant = (typeof choiceCardVariants)[number];
