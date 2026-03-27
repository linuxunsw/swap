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
import type { ButtonVariant } from './components/ui/button';

export const APPLICATION_STATUSES = [
	'draft',
	'submitted',
	'interview_scheduled',
	'interviewed',
	'under_review',
	'offered',
	'rejected'
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

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

