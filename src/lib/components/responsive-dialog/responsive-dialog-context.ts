import type { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
import { IsMobile as IsMobileQuery } from '$lib/hooks/is-mobile.svelte.js';
import { getContext, hasContext } from 'svelte';

export const RESPONSIVE_DIALOG_CONTEXT = Symbol('responsive-dialog-context');

export type ResponsiveDialogContext = {
	isMobile: IsMobile;
};

export function getResponsiveDialogContext(): ResponsiveDialogContext {
	if (hasContext(RESPONSIVE_DIALOG_CONTEXT)) {
		return getContext<ResponsiveDialogContext>(RESPONSIVE_DIALOG_CONTEXT);
	}

	return {
		isMobile: new IsMobileQuery()
	};
}
