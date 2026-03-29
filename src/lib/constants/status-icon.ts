import type { ButtonVariant } from '$lib/components/ui/button';
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
import type { ApplicationStatus } from './application-status';

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
