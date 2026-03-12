import type { Pathname, RouteId } from '$app/types';
import ApplicationIcon from '@lucide/svelte/icons/file-text';
import HouseIcon from '@lucide/svelte/icons/house';
import type { Component } from 'svelte';

export type NavItem = {
	href: Pathname | RouteId;
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
