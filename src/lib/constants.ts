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
export const STATUS_DISPLAY: Record<
	ApplicationStatus,
	{ label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
	draft: { label: 'Draft', variant: 'secondary' },
	submitted: { label: 'Submitted', variant: 'default' },
	interview_scheduled: { label: 'Interview Scheduled', variant: 'default' },
	interviewed: { label: 'Interviewed', variant: 'default' },
	under_review: { label: 'Under Review', variant: 'default' },
	offered: { label: 'Offered', variant: 'default' },
	rejected: { label: 'Rejected', variant: 'destructive' }
};

// Simplified timeline stages visible to applicants.
export const APPLICATION_STAGES: { key: ApplicationStatus[]; label: string }[] = [
	{ key: ['draft'], label: 'Draft' },
	{ key: ['submitted'], label: 'Submitted' },
	{ key: ['interview_scheduled', 'interviewed'], label: 'Interview' },
	{ key: ['under_review'], label: 'Under Review' },
	{ key: ['offered', 'rejected'], label: 'Decision' }
];
