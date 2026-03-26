import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ApplicationStatus } from '$lib/constants';
import type { SubcommitteeOption } from '$lib/server/controllers/subcommittee';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableBadgeList from './data-table-badge-list.svelte';
import DataTableStatus from './data-table-status.svelte';

export type Applicant = {
	id: string;
	name: string;
	status: ApplicationStatus;
	submittedAt?: Date;
	subcommittees: SubcommitteeOption[];
};

export const columns: ColumnDef<Applicant>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.original.status;

			return renderComponent(DataTableStatus, {
				status: status
			});
		}
	},
	{
		accessorKey: 'subcommittees',
		header: 'Subcommittees',
		cell: ({ row, column }) => {
			return renderComponent(DataTableBadgeList, {
				maxWidth: column.getSize(),
				subcommittees: row.original.subcommittees
			});
		}
	},
	{
		accessorKey: 'submittedAt',
		header: 'Submitted At',
		cell: ({ row }) => {
			const formatter = new Intl.DateTimeFormat('en-AU', {
				weekday: 'short',
				day: 'numeric',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit'
			});

			const formattedDateSnippet = createRawSnippet<[{ date?: Date }]>(
				(getDate: () => { date?: Date }) => {
					const date = getDate();
					if (!date) return { render: () => 'N/A' };
					const formatted = formatter.format(getDate().date);
					return {
						render: () => `<span>${formatted}</span>`
					};
				}
			);

			return renderSnippet(formattedDateSnippet, {
				date: row.original.submittedAt
			});
		}
	}
];
