import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ApplicationStatus } from '$lib/constants/application-status';
import type { SubcommitteeOption } from '$lib/server/controllers/subcommittee';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableBadgeList from './data-table-badge-list.svelte';
import DataTableColumnHeader from './data-table-column-header.svelte';
import DataTableStatus from './data-table-status.svelte';

export type Applicant = {
	id: string;
	name: string;
	status: ApplicationStatus;
	submittedAt: Date | null;
	preferredEmail: string;
	discord: string;
	subcommittees: SubcommitteeOption[];
};

export const columns: ColumnDef<Applicant>[] = [
	{
		id: 'actions',
		header: '',
		enableSorting: false,
		enableHiding: false,
		cell: ({ row }) => {
			return renderComponent(DataTableActions, {
				id: row.original.id
			});
		}
	},
	{
		accessorKey: 'name',
		header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Name' }),
		enableHiding: false
	},
	{
		accessorKey: 'status',
		header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Status' }),
		filterFn: (row, columnId, filterValue) => {
			if (!Array.isArray(filterValue) || filterValue.length === 0) {
				return true;
			}
			return filterValue.includes(row.getValue(columnId));
		},
		cell: ({ row }) => {
			const status = row.original.status;

			return renderComponent(DataTableStatus, {
				status: status
			});
		}
	},
	{
		accessorKey: 'subcommittees',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, { column, title: 'Subcommittees' }),
		filterFn: (row, columnId, filterValue) => {
			if (!Array.isArray(filterValue) || filterValue.length === 0) {
				return true;
			}

			const selected = new Set(filterValue as string[]);
			const value = row.getValue(columnId) as SubcommitteeOption[];
			return value.some((subcommittee) => selected.has(subcommittee.id));
		},
		cell: ({ row, column }) => {
			return renderComponent(DataTableBadgeList, {
				maxWidth: column.getSize(),
				subcommittees: row.original.subcommittees
			});
		}
	},
	{
		accessorKey: 'preferredEmail',
		header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Email' })
	},
	{
		accessorKey: 'discord',
		header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Discord' })
	},
	{
		accessorFn: (row) => (row.submittedAt ? row.submittedAt.getTime() : 0),
		id: 'submittedAt',
		header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Submitted' }),
		sortDescFirst: true,
		sortingFn: 'basic',
		cell: ({ row }) => {
			const formatter = new Intl.DateTimeFormat('en-AU', {
				weekday: 'short',
				day: 'numeric',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit'
			});

			const formattedDateSnippet = createRawSnippet<[{ date: Date | null }]>(
				(getDate: () => { date: Date | null }) => {
					const date = getDate();
					if (!date.date) return { render: () => 'N/A' };
					const formatted = formatter.format(date.date);
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
