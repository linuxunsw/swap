import HouseIcon from '@lucide/svelte/icons/house';
import ApplicationIcon from '@lucide/svelte/icons/file-text';
import type { Component } from 'svelte';

export type NavItem = {
	href: string;
	title: string;
	icon: Component;
};

/** Sidebar nav items for the applicant portal. */
export const APPLICANT_NAV: NavItem[] = [
	{ href: '/', title: 'Dashboard', icon: HouseIcon },
	{ href: '/application', title: 'My Application', icon: ApplicationIcon }
];

export function navTitle(pathname: string): string {
	return APPLICANT_NAV.find((item) => item.href === pathname)?.title ?? '';
}
