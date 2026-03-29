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
