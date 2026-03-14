import type { Pathname, RouteId } from '$app/types';
import ApplicationIcon from '@lucide/svelte/icons/file-text';
import HouseIcon from '@lucide/svelte/icons/house';
import type { Component } from 'svelte';
import type { Role } from './constants';

// types
export type NavGroup = {
	title: string;
	items: NavItem[];
};

export type NavItem = {
	href: Pathname | RouteId;
	title: string;
	icon: Component;
};

// route constants
export const APPLICANT_NAV: NavGroup[] = [
	{
		title: 'Applicant',
		items: [
			{ href: '/', title: 'Dashboard', icon: HouseIcon },
			{ href: '/application', title: 'My Application', icon: ApplicationIcon }
		]
	}
];

export const ADMIN_NAV: NavGroup[] = [
	{
		title: 'Admin',
		items: [{ href: '/admin', title: 'Dashboard', icon: HouseIcon }]
	}
];

//
export function getNavGroups(role?: Role): NavGroup[] {
	if (role === 'admin') {
		return ADMIN_NAV;
	}

	return APPLICANT_NAV;
}

export function navTitle(pathname: Pathname | string, role?: Role): string {
	const navGroups = getNavGroups(role);
	for (const { items } of navGroups) {
		const found = items.find(({ href }) => href === pathname);
		if (found) return found.title;
	}
	return '';
}
